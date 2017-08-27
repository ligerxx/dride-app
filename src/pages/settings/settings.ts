import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';

import { Globals } from '../../providers/globals';
import { CalibrationPage } from '../../pages/calibration/calibration';
import { Settings } from '../../providers/settings';
import { FirmwareUpdate } from '../../providers/firmware-update';
import { AuthService } from '../../providers/auth-service';
import { Firebase } from '@ionic-native/firebase';

import { FirmwareUpdatePage } from '../firmware-update-page/firmware-update-page';
import { InAppBrowser } from '@ionic-native/in-app-browser';


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [ Settings, Globals, FirmwareUpdate, FirmwareUpdatePage ]
})
export class SettingsPage {

  settingsNodes: Array<{title: string, category: string, id: string, icon: string}> = 
  [ 
  	{"title": "Sound", "category": "sound", "id": "mute", "icon": "volume-mute"},
  	{"title": "Microphone", "category": "sound", "id": "mic", "icon": "mic"},
  	{"title": "GPS", "category": "gps", "id": "gps", "icon": "navigate"},
  	{"title": "ADAS <label>Beta</label>", "category": "calibration", "id": "adas", "icon": "reverse-camera"},
  	{"title": "Video Recorder", "category": "mode", "id": "dvr", "icon": "videocam"}
  ]


  public configObj: any = {
                            "mode": {
                               "dvr": "False"
                            },
                            "video": {
                              "flip": "False"
                            },
                            "gps": {
                              "gps": "False",
                            },
                            "calibration": {
                              "activation_speed": "0"
                            },
                            "sound": {
                              "mute": "False",
                              "mic": "False"
                            }
                          }


  constructor(public navCtrl: NavController, public settings: Settings, public firmwareUpdate: FirmwareUpdate, private _auth: AuthService, 
              public loadingCtrl: LoadingController, private alertCtrl: AlertController, private firebase: Firebase, private iab: InAppBrowser
              ) {
    

     this.settings.load()
      .then(data => {
        this.configObj = data;
        console.log(data)
      }); 


  }

  ionViewDidLoad() {
    console.log('Hello SettingsPage Page');
  }

  openCalibration() {

    this.navCtrl.push(CalibrationPage);

  }

  // will update dride's firmware.


  promtUpdateDride(){
      let alert = this.alertCtrl.create({
      title: 'Updates Available',
      message: 'Do you want to install these updates to your Dride now?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Install',
          handler: () => {
            this.updateDride()
          }
        }
      ]
    });
    alert.present();
  }





  updateDride(){


    //this.navCtrl.push(FirmwareUpdatePage);

    let loading = this.loadingCtrl.create({
      content: 'Downloading new firmware...'
    });
    loading.present();

    this.firmwareUpdate.getLatestFirmware()
        .then(data => {
            loading.setContent('Installing drideOS..')
            this.firmwareUpdate.uploadFirmwareToDride(data)
                    .then(data => {
                            loading.dismiss();

                              let alert = this.alertCtrl.create({
                                title: 'Software Update Success',
                                subTitle: 'Your drive has been updated and is now restarting.',
                                buttons: ['Close']
                              });
                              alert.present();
                            
                    }, (error) => {
                      //FAILURE
                       loading.dismiss();
                        this.firebase.logEvent("firmware", {content_type: "fail", item_id: "upload", info: error})
                        let alert = this.alertCtrl.create({
                          title: 'Software Update Failed',
                          subTitle: 'An error occurred while updating the firmware. Please let us know what happened at dride.io/forum',
                          buttons: ['Close']
                        });
                        alert.present();
                              
                      console.log(error);
                  })  
            }, (error) => {
            //FAILURE
            console.log(error);
            loading.dismiss();
            this.firebase.logEvent("firmware", {content_type: "fail", item_id: "download", info: error})
            let alert = this.alertCtrl.create({
              title: 'Software Update Failed',
              subTitle: 'An error occurred while downloading the firmware. Please let us know what happened at dride.io/forum',
              buttons: ['OK']
            });
            alert.present();

        })  

  }


  setSetting(fieldName: string, fieldValue: string, CategoryName: string) {

   this.settings.setSettings(fieldName, fieldValue, CategoryName);

  }

  isLoggedIn(){

      //make sure the user Is logged in, a login pop up will jump if not.
      return this._auth.authenticated;

  }

  /*
  *  Will open the dride forum
  */
  sendToSupport(){

    const browser = this.iab.create('https://dride.io/forum', '_system');

  }

  /*
  *  Will show info for the device
  */
  getInfo(){

    let alert = this.alertCtrl.create({
      title: 'Dride Info',
      subTitle: 'Version: ' + this.configObj.os.version,
      buttons: ['Close']
    });
    alert.present();


  }

  logOut(){

      //make sure the user Is logged in, a login pop up will jump if not.
      return this._auth.signOut();

  }


}
