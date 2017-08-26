import { Component } from '@angular/core';
import { ViewController, Platform, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { StatusBar } from '@ionic-native/status-bar';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { Firebase } from '@ionic-native/firebase';

import { AndroidConnectorProvider } from '../../providers/android-connector/android-connector';


/*
  Generated class for the Login component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
	selector: 'login',
	templateUrl: 'login.html'
})
export class LoginComponent {

	login: any;
	isFlipped = false;
	l: { email: string, password: string } = { email: '', password: '' }
	r: { email: string, password: string, name: string } = { email: '', password: '', name: '' }


	public authState: Observable<firebase.User>;
	public isLoaded: boolean = false;

	FB_APP_ID: number = 1825311747740641;


	constructor(public viewCtrl: ViewController, public afAuth: AngularFireAuth, private platform: Platform, private fb: Facebook,
		public statusBar: StatusBar, private alertCtrl: AlertController, private googlePlus: GooglePlus, private firebaseNative: Firebase,
	 	public androidConnectorProvider: AndroidConnectorProvider) {


		this.authState = afAuth.authState;
		setTimeout(() => {
			this.isLoaded = true;
		}, 1000);



	}

	get authenticated(): boolean {
		return this.authState !== null;
	}


	signInWithFacebook(): void {

		if (this.platform.is('cordova')) {

			this.fb.login(['email', 'public_profile']).then(res => {
				const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
				firebase.auth().signInWithCredential(facebookCredential).then(() => this.onSignInSuccess())
					.catch((error) => {

						let alert = this.alertCtrl.create({
							title: 'Pull Over',
							subTitle: error.message,
							buttons: ['Dismiss']
						});
						alert.present();

					});
			})
		} else {
			this.afAuth.auth
				.signInWithPopup(new firebase.auth.FacebookAuthProvider())
				.then(res => console.log(res));
		}

	}

	signInWithGoogle(): void {

		
		this.googlePlus.login({
			'webClientId': '802741428178-b4c1j22k6507i33qhmmqgjem3s5e1ofg.apps.googleusercontent.com',
		})
			.then(res => {
				const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
				firebase.auth().signInWithCredential(googleCredential).then(() => this.onSignInSuccess())
					.catch((error) => {
						console.log('error' + error)
						let alert = this.alertCtrl.create({
							title: 'Pull Over',
							subTitle: error.message,
							buttons: ['Dismiss']
						});
						alert.present();

					});


			})
			.catch(err => console.error(err));



	}


	signInWithEmail(): void {

		firebase.auth().signInWithEmailAndPassword(this.l.email, this.l.password)
			.then(r => {
				this.onSignInSuccess()
			})
			.catch((error: firebase.FirebaseError) => {
				// Handle Errors here.
				this.alertCtrl.create({
					title: 'Pull Over',
					subTitle: error.message,
					buttons: ['Try Again']
				}).present();

			});

	}

	signUpWithEmail(): void {

		firebase.auth().createUserWithEmailAndPassword(this.r.email, this.r.password)
			.then(r => {
				firebase.auth().currentUser.updateProfile({
					displayName: this.r.name,
					photoURL: "https://storage.cloud.google.com/dride-2384f.appspot.com/assets/profilePic/pic" + this.randProfilePic() + ".png"
				}).then(() => {
					this.sendVerificationEmail();
					this.onSignInSuccess()
				}).catch(function (error) {
					// An error happened.
					console.error(error)
				});


			})
			.catch((error: firebase.FirebaseError) => {
				// Handle Errors here.
				this.alertCtrl.create({
					title: 'Pull Over',
					subTitle: error.message,
					buttons: ['Try Again']
				}).present();

			});

	}
	sendVerificationEmail() {
		firebase.auth().currentUser
			.sendEmailVerification()
			.catch(function (error) {
				console.error(error)
			});

	}

	resetPassword() {

		this.alertCtrl.create({
			title: 'Reset Password',
			subTitle: "Enter your email",
			inputs: [
				{
					name: 'email',
					placeholder: 'Email'
				}
			],
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					handler: data => {
						console.log('Cancel clicked');
					}
				},
				{
					text: 'Reset',
					handler: data => {

						firebase.auth().sendPasswordResetEmail(data.email).then( () =>{
						
							this.alertCtrl.create({
								title: 'Success',
								subTitle: "We've just sent you an email to reset your password",
								buttons: ['Thanks!']
							}).present();

						}).catch( (error) => {
							this.alertCtrl.create({
								title: 'Pull Over',
								subTitle: error.message,
								buttons: ['Try Again']
							}).present();
						});


					}
				}
			]
		})
		.present();


	}

	signOut(): void {
		this.afAuth.auth.signOut();
	}

	private randProfilePic() {
		return Math.random() * (5 - 1) + 1
	}


	private onSignInSuccess(): void {
		//set user id to firebase analytics
		this.firebaseNative.setUserId(this.afAuth.auth.currentUser.uid)
		this.firebaseNative.logEvent('signIn', { 'status': 'success' });
		this.viewCtrl.dismiss({ completed: true });
	}

	closeWindow() {

		this.viewCtrl.dismiss({ completed: false });

	}










}

