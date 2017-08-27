import { Injectable, Component } from '@angular/core';
import { ModalController, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { ConnectDrideComponent } from '../components/connect-dride/connect-dride';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Globals } from '../providers/globals';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { BLE } from '@ionic-native/ble';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { environment } from '../environments/environment';
import { ConnectStateProvider } from '../providers/connect-state/connect-state';



declare var bluetoothle: any;
declare var WifiWizard: any;
/*
  Generated class for the DeviceConnectionService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DeviceConnectionService {

	public connectModal: any;
	public isOnlineB: boolean;
	public serviceUUID: string;
	public characteristicUUID: string;
	public online = false;

	constructor(public modalCtrl: ModalController,
		public g: Globals,
		public http: Http,
		public af: AngularFireDatabase,
		private statusBar: StatusBar,
		public platform: Platform,
		private ble: BLE,
		private localNotifications: LocalNotifications,
		public connState: ConnectStateProvider
	) {

		this.isOnlineB = false;
		this.serviceUUID = '1234';
		this.characteristicUUID = '5678'


	}

	ngOnInit() {

		console.log("Scanning Started");

		this.ble.isEnabled().then(res => {
			console.log(res)
			setTimeout(this.scanBLE(), 3000);
		})

	}

	scanBLE() {
		console.log('startBLE')

		this.ble.isEnabled().then(res => {
			console.log('status')
			console.log(res)
		}, err => {
			console.log('err!')
			console.log(err)
			this.ble.enable();
		})


		this.ble.startScan([this.serviceUUID]).subscribe(device => {

			// if we're in the background, add a local notification
			var localNotification = {
				title: 'Dride Discovered',
				text: 'Connect to the dride Wi-Fi network to see your videos'
			};

			// stop scanning and connect automatically
			if (device.name == 'dride' || device.name == 'raspberrypi') {

				this.localNotifications.schedule(localNotification);

				console.log("try to connect")
				this.ble.connect(device.id).subscribe(con => {

					console.log("con")
					console.log(con)

					//send timestamp to device
					var timestamp = parseInt((new Date).getTime() / 1000 + '') + '';
					//7787 is the serviceUUID for time update
					//9997 is the characteristicUUID time update
					this.ble.write(device.id, '7787', '9997', this.stringToBytes(timestamp)).then(res => {
						console.log('res')
						console.log(res)
					}, err => {
						console.log('err')
						console.log(err)
					})

					this.ble.startNotification(device.id, this.serviceUUID, this.characteristicUUID).subscribe(buffer => {

						console.log("onData");
						var data = new Uint32Array(buffer);
						console.log(data[0]);

						var localNotification = {
							title: 'Uploading video..',
							text: 'Click here to share this video with your friends'
						};

						this.localNotifications.schedule(localNotification);

					})


				}, err => {

					console.log('Error connecting to device', err);

					console.log('reconnecting..');
					this.scanBLE();
				});
			}
		},
			err => {
				console.log('Error scanning for Bluetooth devices')
			});

	}

	stringToBytes(string: any) {
		var array = new Uint8Array(string.length);
		for (var i = 0, l = string.length; i < l; i++) {
			array[i] = string.charCodeAt(i);
		}
		return array.buffer;
	}
	z
	isConnected() {
		console.error('isConnected????')
		return new Promise<boolean>((resolve, reject) => {

			this.isOnline().then(resp => {

				if (!resp) {
					if (this.connState.getShowPopupOnConnection()) {
						this.connectModal = this.modalCtrl.create(ConnectDrideComponent);
						this.connectModal.present()
						this.connState.showPopupOnConnection(false)

					}
					resolve(false);

				} else {
					resolve(true);
					if (this.connectModal)
						this.connectModal.dismiss();
				}
			}, err => {
				console.log('other process is connecting.. Terminating.')
			});


		});
	}

	isOnline() {
		return new Promise((resolve, reject) => {

			// if other process already stared to connect
			if (this.connState.getLinkEstablished()) {
				reject();
				return;
			}

			if (this.platform.is('cordova'))
				//return false if not on our WIFI
				WifiWizard.getCurrentSSID(
					currentSSID => {
						let prom = [];
						for (let i = 0; i < environment.ssids.length; i++) {
							if (currentSSID.indexOf(environment.ssids[i]) !== -1) {
								this.isOnlineInner().then(
									r => resolve(r),
									e => resolve(e)
								)
								return;
							}
						}

						setTimeout(() => {
							console.log('Our wifi is not found :(')
							resolve(false);
						}, 2000)

					},
					e => {
						console.error(e)
						resolve(false)
					}
				)
			else {
				console.log('Browser detection')
				this.isOnlineInner().then(
					r => resolve(r),
					e => resolve(e)
				)
			}
		});
	}

	isOnlineInner() {

		// don't have the data yet
		return new Promise(resolve => {

			//if we didn't receive a response than we're not connected!
			setTimeout(() => {
				if (!this.online) {
					this.connState.setLinkEstablished(false);
					resolve(false);
				}
			}, 12000);


			let con = this.http.get(this.g.host + '/api/isOnline')
				.map(res => res.json())
				.timeout(1000)
				.subscribe(
					data => {

						if (data.status) {
							this.makeSureDeviceIsRegistered()
							resolve(true);
							return;
						}

					},
					err => this.connState.setLinkEstablished(false)
				);

		});

	}

	getLinkEstablished(){
		return this.connState.getLinkEstablished()
	}

	makeSureDeviceIsRegistered() {

		let con = this.http.get(this.g.host + '/api/getSerialNumber')
			.map(res => res.json())
			.timeout(2000)
			.subscribe(
			data => {
				const devices = this.af.object('devicesAll/' + data.serial);
				devices.set({ 'lastSeen': (new Date).getTime() });
			}
			);

		return true;


	}



}
