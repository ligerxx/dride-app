import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { environment } from '../../environments/environment';

declare var WifiWizard: any;



@Injectable()
export class AndroidConnectorProvider {

	public scannedNetworks = {}
	constructor(private platform: Platform) {

	}

	android_connectSequence() {

		this.android_scanWifi().then(
			(networks) => {
				this.scannedNetworks = networks;
				this.android_connectToOurWifi(networks);
			}
		);

	}

	android_ifHavePotentialWifi(networks, flat:boolean) {

		for (let i = 0; i < environment.ssids.length; i++) {
			for (let j = 0; j < networks.length; j++) {
				if (flat){
					if (networks[j].indexOf(environment.ssids[i]) !== -1) {
						return networks[j]
					}
				}else{
					if (networks[j].SSID && networks[j].SSID.indexOf(environment.ssids[i]) !== -1) {
						return networks[j]
					}
				}
			}
		}
		return false;
	}
	android_connectToOurWifi(networks) {


		const SSIDtoConnect = this.android_ifHavePotentialWifi(networks, false);

		//TODO: device not in range message
		if (!SSIDtoConnect){
			console.error('Device is not in range..')
			return false;
		}

		//connect to WIFI

		
		// make sure our ssid is in the knows list
		// if not add to list
		this.android_ensureWifiInList().then(
			()=> {
					//connect to WIFI
					WifiWizard.connectNetwork(SSIDtoConnect.SSID,
						() => console.log('Connected successfully to WIFI'),
						(err) => console.error('Connected successfully to WIFI failed', err)
					)
			}, 
			(err)=> {
				console.error(err)
			})





	}


	android_ensureWifiInList(){
		return new Promise( (resolve, reject) => {
			
			WifiWizard.listNetworks(
				(networks) => {
					if (this.android_ifHavePotentialWifi(networks, true))
						resolve()
					else{
						this.android_addToKnownNetworks(this.scannedNetworks).then(
							()=>resolve(), 
							(err)=>reject(err)
						)
					}
				},
				(err) => reject(err));


		});

	}

	// this will add the camera to the known network list 
	// This functions is responsible for managing the passwords..
	android_addToKnownNetworks(networks) {
		return new Promise( (resolve, reject) =>{
			const ourWifiObj = this.android_ifHavePotentialWifi(networks, false)
			
			if (!ourWifiObj)
				reject('No network');

			const wifiObj = WifiWizard.formatWifiConfig(
				ourWifiObj.SSID, //ssid
				environment.wifiPassword, //pass
				'WPA'
			);
			WifiWizard.addNetwork(wifiObj,
				() => {
					resolve();
				},
				(err) => {

					//TODO: deal with wrong password


					console.error(err);
					reject();
				});
		});
	}


	android_scanWifi() {
		return new Promise( (resolve) =>{
			WifiWizard.startScan(
				() => {},
				(err) => console.error(err))

				
			var prom = setTimeout(() => {
				WifiWizard.getScanResults({}, networks => {

					resolve(networks)

				}, err => {
					console.error(err)
				})
			}, 5000);

		});
	}

	/*
	*	Any functions that is activated inside this function will be used with cellular connection
	*/
	android_ensure3G(callback) {

		//if we're not on android make the call
		if (!this.platform.is('android'))
			callback();

		//check if have internet then simply fire the callback
		if (this.android_haveInternet()) {
			callback()
		} else {
			WifiWizard.getCurrentSSID(ssidHandler => {
				WifiWizard.disconnectNetwork(ssidHandler,
					() => {
						callback().then(() => {
							this.android_connectSequence()
						})
					},
					(err) => console.error(err)
				)
			},
				(err) => console.error(err)
			)

		}

	}

	android_haveInternet() {

		return false
	}

}
