import { Component } from '@angular/core';
import { LaunchReview } from '@ionic-native/launch-review';
import { Platform } from 'ionic-angular';  
import { trigger, state, style, transition, animate } from '@angular/animations'
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Firebase } from '@ionic-native/firebase';
import { NativeStorage } from '@ionic-native/native-storage';

/**
 * Generated class for the InFeedPromtComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
	selector: 'in-feed-promt',
	templateUrl: 'in-feed-promt.html',
	animations: [
		trigger(
			'introAnim',
			[
				transition(
					':enter', [
						style({ opacity: 0 }),
						animate('1s cubic-bezier(.75,-0.48,.26,1.52)', style({ transform: 'translateY(0px)', opacity: 1 })),
					]
				),
				transition(
					':leave', [
						style({ 'opacity': 1 }),
						animate('.5s cubic-bezier(.75,-0.48,.26,1.52)', style({ transform: 'translateY(100px)', opacity: 0 })),
					],
				)]
		)
	  ]
})
export class InFeedPromtComponent {

	visible = true;
	screen: string = "pre";
	constructor(private launchReview: LaunchReview, 
				private platform: Platform, 
				private iab: InAppBrowser, 
				private firebaseNative: Firebase,
				private nativeStorage: NativeStorage) {

					if (this.platform.is('cordova'))
						this.nativeStorage.getItem('inFeedPromt')
						.then(
						data => {
							if (data.dte && (new Date().getTime() - data.dte) > 3*24*60*60*1000 )
								this.visible = data.visible
							else
								this.nativeStorage.setItem('inFeedPromt', {visible: true, dte: new Date().getTime()})

							},
						error => console.error(error)
						);

					
	}

	askToLeaveFeedback() {
		this.screen = "feedback";
		this.firebaseNative.logEvent("askToLeaveFeedback", {});
	}
	askToLeaveRating() {
		this.screen = "rating";
		this.firebaseNative.logEvent("askToLeaveRating", {});
	}
	leaveRating() {

		var appId = this.platform.is('ios') ? "1260340386" : 'io.dride.yi';
		this.launchReview.launch(appId).then(r => {
			this.firebaseNative.logEvent("leave review", {});
			this.nativeStorage.setItem('inFeedPromt', {visible: false, dte: new Date().getTime()})
		})

	}
	leaveFeedback() {

		const browser = this.iab.create('https://dride.io/forum?action=post', '_system');
		this.firebaseNative.logEvent("leave feedback", {});
		this.hide()
		this.nativeStorage.setItem('inFeedPromt', {visible: false, dte: new Date().getTime()})
		
	}
	hide() {
		this.visible = false
		this.nativeStorage.setItem('inFeedPromt', {visible: false, dte: new Date().getTime()})
	}
}
