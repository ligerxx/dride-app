import { Component } from '@angular/core';
import { NavController, LoadingController, Platform } from 'ionic-angular';
import { VideoService } from '../../providers/video-service';
import { DeviceConnectionService } from '../../providers/device-connection-service';

import { Globals } from '../../providers/globals';
import { AuthService } from '../../providers/auth-service';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import {Observable} from 'rxjs/Rx';

import firebase from 'firebase';
import { Firebase } from '@ionic-native/firebase';
import { Toast } from '@ionic-native/toast';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';


import {VgAPI} from 'videogular2/core';

@Component({
  selector: 'page-clipsPage',
  templateUrl: 'clipsPage.html',
  providers: [ VideoService, Globals ]
})
 
 
export class clipsPage {


  public data: any;
  public host: string; 
  public videosAll: any;
  public videos: any;

  public vid: HTMLVideoElement;
  public playing: boolean[] = [];
  public progressBar: boolean[] = [];
  public progress: any = 50;
  public currentTime: any = 0;
  
  public watchForDevice: any;
  public loading: any;

  public preload:string = 'auto';
  public api:VgAPI;

   userClipDbObject: FirebaseObjectObservable<any[]>;

    constructor(public navCtrl: NavController,
                public videoService: VideoService, 
                public loadingCtrl: LoadingController, 
                public g: Globals, 
                public af: AngularFire, 
                private _auth: AuthService, 
                public platform: Platform, 
                public connectToDride: DeviceConnectionService,
                private firebaseNative: Firebase,
                private toast: Toast,
                private socialSharing: SocialSharing,
                private transfer: Transfer,
                private file: File
              ) {
                   this.host = g.host;
                   

                  //loop until we got a connection
                  let timer = Observable.timer(0,2000);
                  let withPopUp = true;

                  this.watchForDevice = timer.subscribe(t=> {
                    connectToDride.isConnected(withPopUp).then( data => {

                       withPopUp = false
                       if (data){
                         this.loadClipsKnowingDeviceIsConnected();
                         this.watchForDevice.unsubscribe();
                        }
                    })
                  });



   }

    onPlayerReady(api:VgAPI) {
        this.api = api;

        this.api.getDefaultMedia().subscriptions.ended.subscribe(
            () => {
                // Set the video to the beginning
                this.api.getDefaultMedia().currentTime = 0;
            }
        );
    }



   loadClipsKnowingDeviceIsConnected(){


        this.videoService.load()
        .then(data => {
          this.videosAll = data
          this.videos = [];
          for (var i = 0; i < 2 && this.videosAll.length; i++) {
            this.videos.push( this.videosAll.pop() );
          }

        }); 

   }


  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

      this.videoService.load()
      .then(data => {
        this.videosAll = data
        refresher.complete();
      }); 

  } 

  play(vidoeId) {

    this.vid = <HTMLVideoElement> document.getElementById('v' + vidoeId); 
    this.playing[vidoeId] = true;   
    this.vid.play();  


    setInterval(() => {
      this.currentTime = this.vid.currentTime;
    }, 500);


  }
  pause(vidoeId) {

    this.vid = <HTMLVideoElement> document.getElementById('v' + vidoeId); 
    this.playing[vidoeId] = false;
    this.vid.pause();

  }


  toDate(timeStamp) {
    if (!timeStamp)
      return '';

    var d = new Date(timeStamp * 1000);

    return d.getDate() + '.' + (d.getMonth()+1) + '.' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes();

  }
   

  shareVideo(vidoeId) {

    //make sure the user Is logged in, a login pop up will jump if not.
    this._auth.isLogedIn().then(result => {

        this.download(vidoeId);

    }, function(reason) {
      console.log('close modal without execution.');
    });

        
  }


  deleteVideo(vidoeId) {
      console.log('try to delete' + vidoeId)

      this.videoService.delete(vidoeId)
      .then(data => {

      var index = this.videos.indexOf(vidoeId, 0);
      if (index > -1) {
         this.videos.splice(index, 1);
         
         this.toast.show("Video was deleted", '5000', 'bottom').subscribe(
            toast => {
              console.log(toast);
            }
          );

      }


      }); 

        
  }



  public showLoading(){
    this.loading = this.loadingCtrl.create({
      content: 'Uploading...'
    });

    this.loading.present(); 
  }

  public dismissLoanding(){
    this.loading.dismiss();
  }

  public download(vidoeId){

    if (!this.platform.is('cordova')) {
     alert('Platform not supported');
     return;
    }

    this.showLoading();
  
    const fileTransfer: TransferObject = this.transfer.create();

    let url = this.host + '/modules/video/clip/' + vidoeId + '.mp4';

    fileTransfer.download(url, this.file.dataDirectory + 'tmpSharedClips.mp4').then((entry) => {
      console.log(entry);
      console.log('download complete: ' + entry.toURL());


      this.file.readAsArrayBuffer(this.file.dataDirectory, 'tmpSharedClips.mp4').then(file => {
        this.uploadToDrideNetworkFB(file, vidoeId, 'clips');
        this.uploadThumbOnBackground(vidoeId, fileTransfer);
        this.uploadGPSOnBackground(vidoeId, fileTransfer);
      }).catch(err => console.error('file upload failed ', err));
      
    }, (error) => {
      // handle error
      console.log(error);
    });
  }
 

  public uploadThumbOnBackground(vidoeId, fileTransfer){
    let url = this.host + '/modules/video/thumb/' + vidoeId + '.jpg';

    fileTransfer.download(url, this.file.dataDirectory + 'tmpSharedClips.jpg').then((entry) => {
      console.log(entry);
      console.log('download complete [thumb]: ' + entry.toURL());

      this.file.readAsArrayBuffer(this.file.dataDirectory, 'tmpSharedClips.jpg').then(file => {
        this.uploadToDrideNetworkFB(file, vidoeId, 'thumbs');
      }).catch(err => console.error('file upload failed [thumb] ', err));
      
    }, (error) => {
      // handle error
      console.log(error);
    });
  }

  public uploadGPSOnBackground(vidoeId, fileTransfer){
    let url = this.host + '/modules/video/gps/' + vidoeId + '.json';

    fileTransfer.download(url, this.file.dataDirectory + 'tmpSharedGPS.json').then((entry) => {
      console.log(entry);
      console.log('download complete [thumb]: ' + entry.toURL());

      this.file.readAsArrayBuffer(this.file.dataDirectory, 'tmpSharedGPS.json').then(file => {
        this.uploadToDrideNetworkFB(file, vidoeId, 'gps');
      }).catch(err => console.error('file upload failed [GPS] ', err));
      
    }, (error) => {
      // handle error
      console.log(error);
    });
  }


  public uploadToDrideNetworkFB(file, vidoeId, bucket){


    // Create a root reference
    var uid = this._auth.getUid();

    var storage = firebase.storage();
    const storageRef = storage.ref().child(bucket).child(uid).child(vidoeId + (this.getFileExtensionByBucketName(bucket)));
    storageRef.put(file).then((data) => {
       // success
       console.log("Upload completed  " )

       storageRef.getDownloadURL().then(url => {
         
               //save to DB
                this.userClipDbObject = this.af.database.object('/clips/' + uid + '/' + '/' + vidoeId + '/' + bucket);
                this.userClipDbObject.set({
                    src: url
                }).then(_ => console.log('item added! ' + bucket));

               if (bucket == 'clips'){
                 this.dismissLoanding();
                 this.shareToSocial('https://dride.io/profile/' + uid + '/' + vidoeId )
               }
             }, (err) => {
               // error
               console.log(err)
             })

       });
  }


  public getFileExtensionByBucketName(bucket){

      if (bucket == 'clips' )
        return '.mp4';
      if (bucket == 'thumbs' )
        return '.jpg';
      if (bucket == 'gps' )
        return '.json';

  }

  shareToSocial(url){
    var options = {
      subject: 'dride event', 
      url: url,
      chooserTitle: 'Share an event' // Android only, you can override the default share sheet title
    }

    // Share via share sheet
    this.socialSharing.shareWithOptions(options).then(() => {
      // Success!
      this.firebaseNative.logEvent("video uploaded", {content_type: "share_video", item_id: "home"});
      
    }).catch(() => {
      // Error!
    });
  }

 doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    for (var i = 0; i < 6 && this.videosAll.length; i++) {
      this.videos.push( this.videosAll.pop() );
    }

    console.log('Async operation has ended');
    infiniteScroll.complete();

  }



}

