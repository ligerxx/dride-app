import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CalibrationPage } from '../../pages/calibration/calibration';
import { Settings } from '../../providers/settings';
import { Globals } from '../../providers/globals';


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [ Settings, Globals ]
})
export class SettingsPage {

  settingsNodes: Array<{title: string, category: string, id: string, icon: string}> = 
  [ 
  	{"title": "Sound", "category": "sound", "id": "mute", "icon": "volume-mute"},
  	{"title": "Microphone", "category": "sound", "id": "mic", "icon": "mic"},
  	{"title": "GPS", "category": "gps", "id": "gps", "icon": "navigate"},
  	{"title": "ADAS <label>Beta</label>", "category": "mode", "id": "adas", "icon": "reverse-camera"},
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



  constructor(public navCtrl: NavController, public settings: Settings) {
    

     this.settings.load()
      .then(data => {
        this.configObj = data;
      }); 


  }

  ionViewDidLoad() {
    console.log('Hello SettingsPage Page');
  }

  openCalibration() {

    this.navCtrl.push(CalibrationPage);

  }


  setSetting(fieldName: string, fieldValue: string, CategoryName: string) {

   this.settings.setSettings(this.configObj, fieldName, fieldValue, CategoryName)

  }

}
