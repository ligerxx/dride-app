import { Component } from '@angular/core';
import { ViewController, Platform, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { StatusBar } from '@ionic-native/status-bar';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { Firebase } from '@ionic-native/firebase';
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

  public authState: Observable<firebase.User>;
  public isLoaded: boolean = false;

  FB_APP_ID: number = 1825311747740641;


  constructor(public viewCtrl: ViewController, public afAuth: AngularFireAuth, private platform: Platform, private fb: Facebook,
    public statusBar: StatusBar, private alertCtrl: AlertController, private googlePlus: GooglePlus, private firebaseNative: Firebase) {

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
    }else{
       this.afAuth.auth
          .signInWithPopup(new firebase.auth.FacebookAuthProvider())
          .then(res => console.log(res));
    }

  }

  signInWithGoogle(): void {


        console.log('start google connect')
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

  signOut(): void {
    this.afAuth.auth.signOut();
  }




  private onSignInSuccess(): void {
    this.firebaseNative.logEvent('signIn', {'status': 'success'});
    this.viewCtrl.dismiss({ completed: true });
  }

  closeWindow() {

    this.viewCtrl.dismiss({ completed: false });

  }










}

