import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, Content } from 'ionic-angular';
import { Globals } from '../../providers/globals';
import { AuthService } from '../../providers/auth-service';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { Dialogs } from '@ionic-native/dialogs';
import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';
import firebase from 'firebase';
import { Firebase } from '@ionic-native/firebase';
import { VgAPI } from 'videogular2/core';
import { VideoService } from '../../providers/video-service';
import { CloudPage } from '../../pages/cloud/cloud';

import {  trigger,  state,  style,  animate,  transition} from '@angular/animations';
import { VideoEditor } from '@ionic-native/video-editor';


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
  @ViewChild(Content) content: Content;
  public host: string;
  public videoId: string;
  public api: VgAPI;
  structure: any = { lower: 0, upper: 25 };
  currentTime: number;
  displayCurrentTime: number;
  totalTime: number = 60;
  seekLower: number;
  seekUpper: number;
  licensePlates: string;
  description: string;
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
    public af: AngularFireDatabase,
    public platform: Platform,
    private socialSharing: SocialSharing,
    private transfer: Transfer,
    private file: File,
    private firebaseNative: Firebase,
    public loadingCtrl: LoadingController,
    public videoService: VideoService,
    private videoEditor: VideoEditor,
    private dialogs: Dialogs
  ) {
    this.host = g.host;
    this.videoId = navParams.get('videoId');
    
  }

  ionViewDidEnter() {
    this.getTotalTime();
  }

  getTotalTime() {
    this.api.getDefaultMedia().subscriptions.timeUpdate.subscribe(() => {

      this.totalTime = this.api.getDefaultMedia() ? this.api.getDefaultMedia().time.total / 1000 : 0;

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
  }

  trimFrom() {

    if (this.structure.upper != 25 && this.seekUpper == this.structure.upper) return;

    this.seekUpper = this.structure.upper;
    this.api.seekTime(this.seekUpper);
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

      //check we have at least 150 mb free on device
      this.file.getFreeDiskSpace().then(
        res => {
          if (res > 150000000)
            this.download(this.videoId)
          else{
            this.dialogs.alert('There is not enough space on your device to share this video. Please free up additional space and try again.')
          }
        }

      )


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
    setTimeout( r =>{
          this.content.scrollToBottom(600);
    }, 200)

    const fileTransfer: TransferObject = this.transfer.create();

    let url = this.host + '/modules/video/clip/' + videoId + '.mp4';

    fileTransfer.onProgress((progressEvent: any) => {
      //should be 30% of the entire process
      this.progress = Math.round((progressEvent.loaded / progressEvent.total) * 30);
    });

    fileTransfer.download(url, this.file.tempDirectory + videoId + '_tmp.mp4').then((entry) => {
      console.log(entry);
      console.log('download complete: ' + entry.toURL());

        //trim the video
        this.videoEditor.trim({
                fileUri: entry.toURL(), // path to input video
                trimStart: this.seekLower, // time to start trimming in seconds
                trimEnd: this.seekUpper, // time to end trimming in seconds
                outputFileName: videoId + '_trimmed_' + (new Date).getTime(), // output file name
                progress: (info) => {
                  console.log(info)
                } // optional, see docs on progress
            })
            .then(resPath => {
              console.log('trimSuccess, result: ' + resPath)
              let resultFileName = resPath.replace(/^.*[\\\/]/, '');
              let resultPath = 'file://' + resPath.replace(resultFileName, '');
              console.log('>>>> ' + resultPath + '||' + resultFileName)
              this.file.readAsArrayBuffer(resultPath, resultFileName).then(file => {

                this.uploadToDrideNetworkFB(file, videoId, 'clips');
                this.uploadThumbOnBackground(videoId, fileTransfer);
                //this.uploadGPSOnBackground(videoId, fileTransfer);

                //TODO: then remove all tmp & trimmed files from phone


              }).catch(err => { console.log(err); console.error('file upload failed ', err);});
                  
            })
            .catch((error: any) => console.log('video trim error', error));

    }, (error) => {
      // handle error
      console.log(error);
    });


  }


  public uploadThumbOnBackground(videoId, fileTransfer) {
    let url = this.host + '/modules/video/thumb/' + videoId + '.jpg';

    fileTransfer.download(url, this.file.tempDirectory + 'tmpSharedClips.jpg').then((entry) => {
      console.log(entry);
      console.log('download complete [thumb]: ' + entry.toURL());

      this.file.readAsArrayBuffer(this.file.tempDirectory, 'tmpSharedClips.jpg').then(file => {
        this.uploadToDrideNetworkFB(file, videoId, 'thumbs');
      }).catch(err => console.error('file upload failed [thumb] ', err));

    }, (error) => {
      // handle error
      console.log(error);
    });
  }

  public uploadGPSOnBackground(videoId, fileTransfer) {
    let url = this.host + '/modules/video/gps/' + videoId + '.json';

    fileTransfer.download(url, this.file.tempDirectory + 'tmpSharedGPS.json').then((entry) => {
      console.log(entry);
      console.log('download complete [thumb]: ' + entry.toURL());

      this.file.readAsArrayBuffer(this.file.tempDirectory, 'tmpSharedGPS.json').then(file => {
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
    var metadata = {
      contentType: this.getFileMetaDataByBucketName(bucket),
    };

    var storage = firebase.storage();
    const storageRef = storage.ref().child(bucket).child(uid).child(videoId + (this.getFileExtensionByBucketName(bucket)));
    storageRef.put(file, metadata)
      .on('state_changed',
       snapshot => {
        //dont monitor progress for thumbnail
        if (bucket == 'clips') {
          console.log((snapshot.bytesTransferred / snapshot.totalBytes) * 70 )
          this.progress = 30 + parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 70 + '');
        }

      },
       error =>  console.log(error),
       () => {
        // success
        console.log("Upload completed  ")


        storageRef.getDownloadURL().then(url => {

          //save to DB
          var putObj = {dateUploaded: new Date().getTime(), [bucket]: {'src': url}, plates: this.licensePlates, description: this.description}
          putObj = JSON.parse(JSON.stringify(putObj))

          this.userClipDbObject = this.af.object('/clips/' + uid + '/' + videoId);
          this.userClipDbObject.set(putObj).then(_ => console.log('item added! ' + bucket));

          if (bucket == 'clips') {
            this.dismissLoading();
            // upload done
            this.dialogs.alert('Great! Your video is now on Dride-Cloud.', 'WhoHoo 🙌').then(r => {
                this.navCtrl.push(CloudPage)
            })



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

  public getFileMetaDataByBucketName(bucket){

      if (bucket == 'clips' )
        return 'video/mp4';
      if (bucket == 'thumbs' )
        return 'image/jpeg';
      if (bucket == 'gps' )
        return 'application/octet-stream';

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
