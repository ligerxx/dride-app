import { Component } from '@angular/core';
import { NavController, LoadingController, Platform } from 'ionic-angular';
import { Transfer, SocialSharing, File } from 'ionic-native';
import { VideoService } from '../../providers/video-service';
import { DeviceConnectionService } from '../../providers/device-connection-service';

import { Globals } from '../../providers/globals';
import { AuthService } from '../../providers/auth-service';
import { AngularFire } from 'angularfire2';


@Component({
  selector: 'page-clipsPage',
  templateUrl: 'clipsPage.html',
  providers: [ VideoService, Globals ]
})
 
 
export class clipsPage {


  public data: any;
  //public host: string = "http://192.168.2.2"; 
  public host: string = "http://192.168.42.1:9000"; 
  public videosAll: any;
  public videos: any;

  public vid: HTMLVideoElement;
  public playing: boolean[] = [];
  public progressBar: boolean[] = [];
  public progress: any = 50;
  public currentTime: any = 0;

  public loading: any;

   public users = [
     "151515115151" ,
     "151516115151" ,
     "151517115151" ,
     "151518115151" ,
     "151519115151" ,
     "151520115151" ,
     "151521115151" ,
     "151522115151" ,
     "151523115151" ,
     "151524115151" 
   ];

 

    constructor(public navCtrl: NavController,
                public videoService: VideoService, 
                public loadingCtrl: LoadingController, 
                public g: Globals, 
                public af: AngularFire, 
                private _auth: AuthService, 
                public platform: Platform, 
                public connectToDride: DeviceConnectionService
              ) {
 
                    connectToDride.isConnected().then( data => {
                       this.host = g.host;
                   
                        this.videoService.load()
                        .then(data => {
                          this.videosAll = data
                          this.videos = [];
                          for (var i = 0; i < 2 && this.videosAll.length; i++) {
                            this.videos.push( this.videosAll.pop() );
                          }

                        }); 
                    })

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


  showLoading(){
    this.loading = this.loadingCtrl.create({
      content: 'Uploading...'
    });

    this.loading.present(); 
  }

  dismissLoanding(){
    this.loading.dismiss();
  }

  download(vidoeId){

    if (!this.platform.is('cordova')) {
     alert('Platform not supported');
     return;
    }

    this.showLoading();
  
    const fileTransfer = new Transfer();

    let url = this.host + '/modules/video/clip/' + vidoeId + '.mp4';

    fileTransfer.download(url, cordova.file.dataDirectory + 'tmpSharedClips.mp4').then((entry) => {
      console.log(entry);
      console.log('download complete: ' + entry.toURL());


      File.readAsArrayBuffer(cordova.file.dataDirectory, 'tmpSharedClips.mp4').then(file => {
        this.uploadToDrideNetworkFB(file, vidoeId);
      }).catch(err => console.error('file upload failed ', err));
      
    }, (error) => {
      // handle error
      console.log(error);
    });
  }
 
  uploadToDrideNetworkFB(file, vidoeId){


    // Create a root reference
    var uid = this._auth.getUid();

    console.log(this._auth)
    var storage = firebase.storage();
    var storageRef = storage.ref().child('clips').child(uid).child(vidoeId + '.mp4');
    storageRef.put(file).then((data) => {
       // success
       console.log("Upload completed  " )
       //var httpsReference = storage.refFromURL('https://firebasestorage.googleapis.com/b/dride-2384f/o/clips/' + uid + '/' + vidoeId + '.mp4');


       this.dismissLoanding();
       this.shareToSocial('https://dride.io/profile/' + uid + '/' + vidoeId )
     }, (err) => {
       // error
       console.log(err)
     })


  }


  shareToSocial(url){
    var options = {
      subject: 'dride event', 
      url: url,
      chooserTitle: 'Share an event' // Android only, you can override the default share sheet title
    }

    // Share via share sheet
    SocialSharing.shareWithOptions(options).then(() => {
      // Success!
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

