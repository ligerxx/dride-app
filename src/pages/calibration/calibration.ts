import { Component } from '@angular/core';
import { NavController, Platform, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Transfer, File } from 'ionic-native';
import { Globals } from '../../providers/globals';
import { Observable } from 'rxjs/Rx';
import { Settings } from '../../providers/settings';
import { ManualCalibration } from '../../pages/manual-calibration/manual-calibration';
import { AuthService } from '../../providers/auth-service';
import firebase from 'firebase';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

/*
  Generated class for the Calibration page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-calibration',
  templateUrl: 'calibration.html',
    providers: [ Globals, Settings ]
})
export class CalibrationPage {

  public host: string; 
  public calibrationClips: any;
  public loading: any;
  public userClipDbObject: FirebaseObjectObservable<any[]>;
  public serialNumber: String;
  public calibrationStatus: String;
  public calibrationStatusObj: FirebaseObjectObservable<any[]>;

  public calibrationObj: any;





  constructor(public navCtrl: NavController, public g: Globals, public settings: Settings, public http: Http,
              private _auth: AuthService, public platform: Platform, public loadingCtrl: LoadingController, public af: AngularFire,
              ) {

    this.host = g.host;


  }



  ionViewDidLoad() {

   //get serialNumber && calibrationStatus
   this.getSerialNumber().then(res => {
     this.getCalibrationStatus().then(res => {

           //if we need to upload new defaults file do this now
            if (this.calibrationObj.calibrationStatus == 'pendingUpload')    {

                this.settings.setSettings('x1', this.calibrationObj.data.x1, 'calibration');
                this.settings.setSettings('y1', this.calibrationObj.data.y1, 'calibration');
                this.settings.setSettings('road_height', this.calibrationObj.data.road_height, 'calibration');
                this.settings.setSettings('road_width', this.calibrationObj.data.road_width, 'calibration');
                this.settings.setSettings('square_width', this.calibrationObj.data.square_width, 'calibration');
                this.settings.setSettings('square_height', this.calibrationObj.data.square_height, 'calibration');

                this.userClipDbObject = this.af.database.object('devices/' +'/' + this._auth.getUid() + '/' + this.serialNumber);
                this.userClipDbObject.update({
                    calibrationStatus: ''
                }).then(_ => console.log('defaults updated'));

            }


     })
   })
 


    this.getCalibrationClips();
  }



  getCalibrationClips(){


    // don't have the data yet
    return new Promise(resolve => {

      this.http.get( this.host + '/api/getCalibrationClips')
        .map(res => res.json())
        .subscribe(data => {

          this.calibrationClips = data.data;
          
          resolve(this.calibrationClips);
        });
    });
  




  }


  uploadClipsForCalibration() {


    //make sure the user Is logged in, a login pop up will jump if not.
    this._auth.isLogedIn().then(result => {


        //loop 5 clips on this.calibrationClips
        for (var key in this.calibrationClips) {
             this.download(this.calibrationClips[key]);
        };



    }, function(reason) {
      console.log('close modal without execution.');
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
  
    const fileTransfer = new Transfer();

    let url = this.host + '/modules/video/clip/' + vidoeId + '.mp4';

    fileTransfer.download(url, cordova.file.dataDirectory + 'tmpSharedClips.mp4').then((entry) => {
      console.log(entry);
      console.log('download complete: ' + entry.toURL());


      File.readAsArrayBuffer(cordova.file.dataDirectory, 'tmpSharedClips.mp4').then(file => {
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

    fileTransfer.download(url, cordova.file.dataDirectory + 'tmpSharedClips.jpg').then((entry) => {
      console.log(entry);
      console.log('download complete [thumb]: ' + entry.toURL());

      File.readAsArrayBuffer(cordova.file.dataDirectory, 'tmpSharedClips.jpg').then(file => {
        this.uploadToDrideNetworkFB(file, vidoeId, 'thumbs');
      }).catch(err => console.error('file upload failed [thumb] ', err));
      
    }, (error) => {
      // handle error
      console.log(error);
    });
  }

  public uploadGPSOnBackground(vidoeId, fileTransfer){
    let url = this.host + '/modules/video/gps/' + vidoeId + '.json';

    fileTransfer.download(url, cordova.file.dataDirectory + 'tmpSharedGPS.json').then((entry) => {
      console.log(entry);
      console.log('download complete [thumb]: ' + entry.toURL());

      File.readAsArrayBuffer(cordova.file.dataDirectory, 'tmpSharedGPS.json').then(file => {
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

                //mark clip as un-active
                this.userClipDbObject = this.af.database.object('/clips/' + uid + '/' + '/' + vidoeId );
                this.userClipDbObject.update({
                    active: 0
                });

                //update calibration Status for DEVICE to watingForCalibration
                this.userClipDbObject = this.af.database.object('/devices/' +'/' + uid + '/' + this.serialNumber + '/' );
                this.userClipDbObject.update({
                    calibrationStatus: 'watingForCalibration'
                });

               if (bucket == 'clips'){
                 this.dismissLoanding();
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


  public getSerialNumber(){

    // don't have the data yet
    return new Promise(resolve => {

      this.http.get( this.host + '/api/getSerialNumber')
        .map(res => res.json())
        .subscribe(data => {

          this.serialNumber = data.serial;
          
          resolve(this.serialNumber);
        });
    });
  }

  public getCalibrationStatus(){


    return new Promise(resolve => {

       this.af.database.object('devices/' +'/' + this._auth.getUid() + '/' + this.serialNumber, { preserveSnapshot: true })
       .subscribe(snapshot => {
          this.calibrationObj = snapshot.val()
          resolve(this.calibrationObj)
        });

    });

  }




  manualCalibration() {
    this.navCtrl.push(ManualCalibration);
  }




}
