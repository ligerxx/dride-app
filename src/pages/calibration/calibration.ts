import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Calibration page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-calibration',
  templateUrl: 'calibration.html'
})
export class CalibrationPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello CalibrationPage Page');
  }

}
