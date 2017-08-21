import { Component } from '@angular/core';
import { ModalController, Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

declare var WifiWizard: any;


/*
  Generated class for the ConnectDride component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'connect-dride',
  templateUrl: 'connect-dride.html'
})
export class ConnectDrideComponent {

  public isLoaded: boolean = false;

  constructor(public modalCtrl: ModalController, private iab: InAppBrowser, public platfrom: Platform) {

	this.connectToWifi();

  }

  connectToWifi() {
		
	if (this.platfrom.is('ios')){
		setTimeout(() => {
			this.isLoaded =true;
		}, 1000);
	}

	if (this.platfrom.is('android')){

		//make sure WIFI is on if not open it

		WifiWizard.startScan()
		setTimeout(() => {
			WifiWizard.getScanResults({}, networks => {
				// TODO: add expected SSID to config
				// loop the reaults and look for the SSID 'dride'
				console.error(networks)

					//connect to the WIFI network
					//TODO: ...

			}, err => {
				console.error(err)
			})
		}, 2000);

	}
  }

  /* android only
  *	 Android Only
  *  We will use this to upload to Dride cloud if we dont have internet connection	
  */
  connectTo3G(){

	//TODO: ...
	// Only if we dont have internet disconnect from WIFI


  }

  buyDride(){

    const browser = this.iab.create('https://dride.io/store', '_system');

  }



}


