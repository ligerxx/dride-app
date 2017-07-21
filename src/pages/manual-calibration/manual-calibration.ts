import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams  } from 'ionic-angular';
import { Globals } from '../../providers/globals';
import { Observable } from 'rxjs/Rx';
import { Settings } from '../../providers/settings';


/**
 * Generated class for the ManualCalibration page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-manual-calibration',
  templateUrl: 'manual-calibration.html',
  providers: [ Globals, Settings ]
})
export class ManualCalibration {

  public host: string; 
  public imgSrc: string; 

  public calibrationObj: any

  constructor(public navCtrl: NavController, public g: Globals, public settings: Settings) {

  	this.host = g.host;
  	this.imgSrc = this.host + '/api/getCalibrationImage/';
  	
  	//start calibration
  	this.settings.setSettings('in_calibration', 'True', 'mode')

	 this.settings.load()
	  .then(data => {
	    this.calibrationObj = data.calibration;

	  }); 

  	Observable.interval(1000)
	  .subscribe(data => {
	  	console.log('updateCurrentFrame');
	    this.imgSrc = this.host + '/api/getCalibrationImage/?time=' + new Date();

	  })

  }


  updateCalibration(direction: String){

  	if (direction == 'right'){
   		this.settings.setSettings('x1', (parseInt(this.calibrationObj.x1) + 10) + '', 'calibration')
   		this.calibrationObj.x1 = (parseInt(this.calibrationObj.x1) + 10) + ''
  	}
  	if (direction == 'left'){
   		this.settings.setSettings('x1', (parseInt(this.calibrationObj.x1) - 10) + '', 'calibration')
   		this.calibrationObj.x1 = (parseInt(this.calibrationObj.x1) - 10) + ''
  	}


  	if (direction == 'up'){
   		this.settings.setSettings('y1', (parseInt(this.calibrationObj.y1) - 10) + '', 'calibration')
   		this.calibrationObj.y1 = (parseInt(this.calibrationObj.y1) - 10) + ''

  	}
  	if (direction == 'down'){
   		this.settings.setSettings('y1', (parseInt(this.calibrationObj.y1) + 10) + '', 'calibration')
   		this.calibrationObj.y1 = (parseInt(this.calibrationObj.y1) + 10) + ''
  	}


  }


  finishCalibration(){

   	this.settings.setSettings('in_calibration', 'False', 'mode')

   	this.navCtrl.pop();


  }






}
