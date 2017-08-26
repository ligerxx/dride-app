import { Component } from '@angular/core';
import { ModalController, Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';

import { ConnectStateProvider } from '../../providers/connect-state/connect-state';
import { environment } from '../../environments/environment';
import { AndroidConnectorProvider } from '../../providers/android-connector/android-connector';

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

  constructor(public modalCtrl: ModalController, 
	private iab: InAppBrowser, 
	public platfrom: Platform, 
	public connState: ConnectStateProvider,
	private openNativeSettings: OpenNativeSettings,
    private androidConnect: AndroidConnectorProvider) {

  }

  ionViewWillEnter() {
	this.connectToWifi();
  }

  connectToWifi() {
		
	// for the small animation of the car
	setTimeout(() => {
		this.isLoaded =true;
	}, 1000);


	if (this.platfrom.is('android')){

		//make sure WIFI is on if not open it
		WifiWizard.setWifiEnabled(true, 
			() => {
				const r = this.androidConnect.android_connectSequence()
				console.error('r')
				console.error(r)
			},
			(err) => console.error(err)
		)



	}
  }


  goToWifiSettings() {
	  this.openNativeSettings.open('wifi')
  }
  /*
  *	Android is able to connect to device on it own so we will start connection sequence automatically on Android only
  */
  getConnectionLink() {
	return this.connState.getLinkEstablished() || this.platfrom.is('android');
  }


  buyDride(){

    const browser = this.iab.create('https://dride.io/store?ref=app', '_system');

  }



}


