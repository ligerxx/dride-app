import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CalibrationPage } from '../../pages/calibration/calibration';
import { Settings } from '../../providers/settings';


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [ Settings ]
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


  public host: string = "http://192.168.2.3:9000";

  constructor(public navCtrl: NavController, public settings: Settings) {
    

     this.settings.load(this.host)
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

   this.settings.setSettings(this.configObj, this.host, fieldName, fieldValue, CategoryName)

  }

}
