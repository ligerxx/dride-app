import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { Globals } from '../../providers/globals';
import { AuthService } from '../../providers/auth-service';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';
import firebase from 'firebase';
import { Firebase } from '@ionic-native/firebase';
import { VgAPI } from 'videogular2/core';
import { VideoService } from '../../providers/video-service';

/**
 * Generated class for the UploadPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html',
  providers: [VideoService]
})
export class UploadPage {

  public host: string;
  public videoId: string;
  public api: VgAPI;
  structure: any = { lower: 0, upper: 25 };
  currentTime: number;
  displayCurrentTime: number;
  totalTime: number = 60;
  seekLower: number;
  seekUpper: number;
  userClipDbObject: FirebaseObjectObservable<any[]>;
  public loading: any;
  public videosAll: any;
  public videos: any;
  public progress: number = 0;
  public downloadStatus: string = '';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public g: Globals,
    private _auth: AuthService,
    public af: AngularFire,
    public platform: Platform,
    private socialSharing: SocialSharing,
    private transfer: Transfer,
    private file: File,
    private firebaseNative: Firebase,
    public loadingCtrl: LoadingController,
    public videoService: VideoService
  ) {
    this.host = g.host;
    this.videoId = navParams.get('videoId');
  }

  ionViewDidEnter() {
    this.getTotalTime();
  }

  getTotalTime() {
    this.api.getDefaultMedia().subscriptions.timeUpdate.subscribe(() => {

      this.totalTime = this.api.getDefaultMedia().time.total / 1000;

    });
  }
  trim() {
    this.trimTo();
    this.trimFrom();
  }
  trimTo() {
    if (this.structure.lower && this.seekLower == this.structure.lower) return;

    this.seekLower = this.structure.lower;
    this.api.seekTime(this.seekLower);
    console.log("trimto", this.seekLower);
  }

  trimFrom() {
    if (this.structure.upper != 25 && this.seekUpper == this.structure.upper) return;

    this.seekUpper = this.structure.upper;
    this.api.seekTime(this.seekUpper);
    console.log("trimFrom", this.seekUpper);
  }

  onPlayerReady(api: VgAPI) {
    this.api = api;

    this.api.getDefaultMedia().subscriptions.ended.subscribe(
      () => {
        // Set the video to the beginning
        this.api.getDefaultMedia().currentTime = 0;
      }
    );
  }


  cropAndUpload() {

    //make sure the user Is logged in, a login pop up will jump if not.
    this._auth.isLogedIn().then(result => {

      this.download(this.videoId)

    }, function (reason) {
      console.log('close modal without execution.');
    });





  }


  public download(videoId) {

    if (!this.platform.is('cordova')) {
      alert('Platform not supported');
      return;
    }

    this.showLoading('Downloading video from device.');

    const fileTransfer: TransferObject = this.transfer.create();

    let url = this.host + '/modules/video/clip/' + videoId + '.mp4';

    fileTransfer.onProgress((progressEvent: any) => {
      this.progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
    });

    fileTransfer.download(url, this.file.dataDirectory + 'tmpSharedClips.mp4').then((entry) => {
      console.log(entry);
      console.log('download complete: ' + entry.toURL());

      this.file.readAsArrayBuffer(this.file.dataDirectory, 'tmpSharedClips.mp4').then(file => {
        this.uploadToDrideNetworkFB(file, videoId, 'clips');
        this.uploadThumbOnBackground(videoId, fileTransfer);
        //this.uploadGPSOnBackground(videoId, fileTransfer);
      }).catch(err => console.error('file upload failed ', err));

    }, (error) => {
      // handle error
      console.log(error);
    });


  }


  public uploadThumbOnBackground(videoId, fileTransfer) {
    let url = this.host + '/modules/video/thumb/' + videoId + '.jpg';

    fileTransfer.download(url, this.file.dataDirectory + 'tmpSharedClips.jpg').then((entry) => {
      console.log(entry);
      console.log('download complete [thumb]: ' + entry.toURL());

      this.file.readAsArrayBuffer(this.file.dataDirectory, 'tmpSharedClips.jpg').then(file => {
        this.uploadToDrideNetworkFB(file, videoId, 'thumbs');
      }).catch(err => console.error('file upload failed [thumb] ', err));

    }, (error) => {
      // handle error
      console.log(error);
    });
  }

  public uploadGPSOnBackground(videoId, fileTransfer) {
    let url = this.host + '/modules/video/gps/' + videoId + '.json';

    fileTransfer.download(url, this.file.dataDirectory + 'tmpSharedGPS.json').then((entry) => {
      console.log(entry);
      console.log('download complete [thumb]: ' + entry.toURL());

      this.file.readAsArrayBuffer(this.file.dataDirectory, 'tmpSharedGPS.json').then(file => {
        this.uploadToDrideNetworkFB(file, videoId, 'gps');
      }).catch(err => console.error('file upload failed [GPS] ', err));

    }, (error) => {
      // handle error
      console.log(error);
    })
  }


  public uploadToDrideNetworkFB(file, videoId, bucket) {


    // Create a root reference
    var uid = this._auth.getUid();
    this.showLoading('Uploading video to Dride-Cloud.');

    var storage = firebase.storage();
    const storageRef = storage.ref().child(bucket).child(uid).child(videoId + (this.getFileExtensionByBucketName(bucket)));
    storageRef.put(file)
      .on('state_changed',
       snapshot => {
        //dont monitor progress for thumbnail
        if (bucket != 'clips') 
          return;

        this.progress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100 + '');

      },
       error =>  console.log(error),
       () => {
        // success
        console.log("Upload completed  ")
        if (bucket != 'clips') 
          return;

        this.dismissLoading();
        storageRef.getDownloadURL().then(url => {

          //save to DB
          this.userClipDbObject = this.af.database.object('/clips/' + uid + '/' + '/' + videoId + '/' + bucket);
          this.userClipDbObject.set({
            src: url
          }).then(_ => console.log('item added! ' + bucket));

          if (bucket == 'clips') {
            this.dismissLoading();
            this.shareToSocial('https://dride.io/profile/' + uid + '/' + videoId)
          }
        }, (err) => {
          // error
          console.log(err)
        })

      })




  }


  public getFileExtensionByBucketName(bucket) {

    if (bucket == 'clips')
      return '.mp4';
    if (bucket == 'thumbs')
      return '.jpg';
    if (bucket == 'gps')
      return '.json';

  }

  shareToSocial(url) {
    var options = {
      subject: 'dride event',
      url: url,
      chooserTitle: 'Share an event' // Android only, you can override the default share sheet title
    }

    // Share via share sheet
    this.socialSharing.shareWithOptions(options).then(() => {
      // Success!
      this.firebaseNative.logEvent("video uploaded", { content_type: "share_video", item_id: "home" });

    }).catch(() => {
      // Error!
    });
  }

  public showLoading(status: string) {

    this.downloadStatus = status


  }

  public dismissLoading() {
    this.downloadStatus = null
  }



}
