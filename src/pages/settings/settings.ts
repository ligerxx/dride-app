import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CalibrationPage } from '../../pages/calibration/calibration';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  settingsNodes: Array<{title: string, id: string, icon: string}> = 
  [ 
  	{"title": "Sound", "id": "sound", "icon": "volume-mute"},
  	{"title": "Microphone", "id": "mic", "icon": "mic"},
	{"title": "GPS", "id": "gps", "icon": "navigate"},
	{"title": "ADAS <label>Beta</label>", "id": "adas", "icon": "reverse-camera"},
	{"title": "Video Recorder ", "id": "dvr", "icon": "videocam"}
  ]

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello SettingsPage Page');
  }

  openCalibration() {

    this.navCtrl.push(CalibrationPage);
  }


}
