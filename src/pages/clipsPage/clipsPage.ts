import { Component } from '@angular/core';
import { NavController, LoadingController, Platform, ActionSheetController, ModalController } from 'ionic-angular';
import { VideoService } from '../../providers/video-service';
import { DeviceConnectionService } from '../../providers/device-connection-service';
import { UploadPage } from '../../components/upload/upload';
import { LivePage } from '../../pages/live/live';


import { Globals } from '../../providers/globals';
import { AuthService } from '../../providers/auth-service';
import { Observable } from 'rxjs/Rx';

import { Firebase } from '@ionic-native/firebase';
import { Toast } from '@ionic-native/toast';



import { VgAPI } from 'videogular2/core';

@Component({
	selector: 'page-clipsPage',
	templateUrl: 'clipsPage.html',
	providers: [VideoService, Globals]
})


export class clipsPage {


	public data: any;
	public host: string;
	public videosAll: any;
	public videos: any;

	public vid: HTMLVideoElement;
	public playing: boolean[] = [];
	public progressBar: boolean[] = [];
	public progress: any = 50;
	public currentTime: any = 0;

	public watchForDevice: any;
	public loading: any;

	public api: VgAPI;
	livePage: any;
	public addedInFeedByType = [false, false, false, false]

	constructor(public navCtrl: NavController,
		public videoService: VideoService,
		public loadingCtrl: LoadingController,
		public g: Globals,
		private _auth: AuthService,
		public platform: Platform,
		public connectToDride: DeviceConnectionService,
		private firebaseNative: Firebase,
		private toast: Toast,
		public actionSheetCtrl: ActionSheetController,
		public modalCtrl: ModalController
	) {

	}

	ionViewWillEnter() {
		this.host = this.g.host;
		this.livePage = LivePage;

		//loop until we got a connection
		let timer = Observable.timer(0, 3000);


		this.watchForDevice = timer.subscribe(t => {
			this.connectToDride.isConnected().then(data => {

				if (data) {
					this.loadClipsKnowingDeviceIsConnected();
					this.watchForDevice.unsubscribe();
				}
			},
				err => {
					console.error(err)
				})
		});

	}
	ngOnDestroy() {
		this.watchForDevice.unsubscribe();
	}


	onPlayerReady(api: VgAPI, videoId: string) {

		api.getDefaultMedia().subscriptions.ended.subscribe(
			() => {
				// Set the video to the beginning
				api.getDefaultMedia().currentTime = 0;
			}
		);

		api.getDefaultMedia().subscriptions.pause.subscribe(
			() => {
				console.log("pause")
				this.firebaseNative.logEvent('pause', { "vid": '?' });
			}
		);
		api.getDefaultMedia().subscriptions.playing.subscribe(
			() => {
				console.log("play")
				this.playing[videoId] = true;
				this.firebaseNative.logEvent('playing', { "vid": '?' });
			}
		);



	}



	loadClipsKnowingDeviceIsConnected() {
		this.videoService.load()
			.then(data => {
				this.videosAll = data
				this.videos = [];
				for (var i = 0; i < 3 && this.videosAll.length; i++) {
					let currentVideo = this.videosAll.pop();

					if (this.testImage(this.host + '/modules/video/thumb/' + currentVideo + '.jpg'))
						this.videos.push(currentVideo);
					else
						console.log('img not found')
				}
				this.firebaseNative.logEvent('videos_loaded', { "count": this.videos.length });


			});

	}


	doRefresh(refresher) {
		console.log('Begin async operation', refresher);

		this.videoService.load()
			.then(data => {
				this.videosAll = data
				refresher.complete();
			});

	}



	toDate(timeStamp) {
		if (!timeStamp)
			return '';

		var d = new Date(timeStamp * 1000);

		return d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes();

	}


	shareVideo(videoId) {

		this.firebaseNative.logEvent('share', { "action": 'click' });
		//make sure the user Is logged in, a login pop up will jump if not.
		this._auth.isLogedIn().then(result => {

			//open login pop up
			let uploadModal = this.modalCtrl.create(UploadPage, { 'videoId': videoId });
			uploadModal.onDidDismiss(data => {
				this.firebaseNative.logEvent('share', { "action": 'close window' });
			});
			uploadModal.present();


		}, function (reason) {
			console.log('close modal without execution.');
		});


	}

	deleteVideo(videoId) {
		console.log('try to delete' + videoId)

		this.videoService.delete(videoId)
			.then(data => {

				var index = this.videos.indexOf(videoId, 0);
				if (index > -1) {
					this.videos.splice(index, 1);

					this.toast.show("Video was Deleted", '5000', 'bottom').subscribe(
						toast => {
							console.log(toast);
						}
					);

					this.firebaseNative.logEvent('deleteVideo', { 'vid': this.videos });
				}


			});


	}

	presentActionSheet(videoId) {
		let actionSheet = this.actionSheetCtrl.create({
			title: 'Video on Device',
			buttons: [
				// {
				//   text: 'Show on map',
				//   handler: () => {
				//     alert('show map')
				//   }
				// },
				{
					text: 'Upload to Dride-Cloud',
					handler: () => {
						this.shareVideo(videoId)
					}
				},
				{
					text: 'Delete',
					role: 'destructive',
					handler: () => {
						this.deleteVideo(videoId)
					}
				},
				{
					text: 'Close',
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					}
				}
			]
		});
		actionSheet.present();
	}

	/*
	*  This will prevent blank images to load
	*/
	testImage(url) {
		return new Promise(function (resolve, reject) {
			resolve("success");

			// var timeout = 5000;
			// var timer, img = new Image();
			// img.onerror = img.onabort = function () {
			//     clearTimeout(timer);
			//     reject("error");
			// };
			// img.onload = function () {
			//     clearTimeout(timer);
			//     resolve("success");
			// };
			// timer = setTimeout(function () {
			//     // reset .src to invalid URL so it stops previous
			//     // loading, but doesn't trigger new load
			//     img.src = "//!!!!/test.jpg";
			//     reject("timeout");
			// }, timeout);
			// img.src = url;
		});
	}

	doInfinite(infiniteScroll) {

		if (!this.videosAll) {
			infiniteScroll.complete();
			return;
		}

		for (var i = 0; i < 6 && this.videosAll.length; i++) {

			//insert inFeedPromt slides
			if (this.videosAll.length > 4 && !this.addedInFeedByType[2]) {
				this.videos.push({ type: 2 });
				this.addedInFeedByType[2] = true;
			}


			let currentVideo = this.videosAll.pop();

			this.testImage(this.host + '/modules/video/thumb/' + currentVideo + '.jpg')
				.then(r => this.videos.push(currentVideo))
				.catch(err => console.log('img not found'))

		}

		infiniteScroll.complete();

	}



}

