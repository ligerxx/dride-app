import { Component } from '@angular/core';
import { NavController, LoadingController, Platform, ActionSheetController } from 'ionic-angular';
import { VideoService } from '../../providers/video-service';
import { DeviceConnectionService } from '../../providers/device-connection-service';
import { UploadPage } from '../../pages/upload/upload';
import { LivePage } from '../../pages/live/live';


import { Globals } from '../../providers/globals';
import { AuthService } from '../../providers/auth-service';
import { Observable } from 'rxjs/Rx';

import { Firebase } from '@ionic-native/firebase';
import { Toast } from '@ionic-native/toast';



import { VgAPI } from 'videogular2/core';

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
  livePage: any;


    constructor(public navCtrl: NavController,
                public videoService: VideoService, 
                public loadingCtrl: LoadingController, 
                public g: Globals, 
                private _auth: AuthService, 
                public platform: Platform, 
                public connectToDride: DeviceConnectionService,
                private firebaseNative: Firebase,
                private toast: Toast,
                public actionSheetCtrl: ActionSheetController
              ) {
                   this.host = g.host;
                   this.livePage = LivePage;

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
          for (var i = 0; i < 3 && this.videosAll.length; i++) {
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

        this.navCtrl.push(UploadPage,  {
          videoId: vidoeId
        })

        // this.navCtrl.push(UploadPage,  {
        //   videoId: vidoeId
        // })

    }, function(reason) {
      console.log('close modal without execution.');
    });

        
  }

  deleteVideo(videoId) {
    console.log('try to delete' + videoId)

    this.videoService.delete(videoId)
      .then(data => {

        var index = this.videos.indexOf(videoId, 0);
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

  presentActionSheet(videoId) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Video On Device',
      buttons: [
        // {
        //   text: 'Show on map',
        //   handler: () => {
        //     alert('show map')
        //   }
        // },
        {
          text: 'Upload to Dride-Cloud',
          handler: () => {
            this.shareVideo(videoId)
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteVideo(videoId)
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

 doInfinite(infiniteScroll) {

    for (var i = 0; i < 6 && this.videosAll.length; i++) {
      this.videos.push( this.videosAll.pop() );
    }
    infiniteScroll.complete();

  }



}

