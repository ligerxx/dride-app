import { Platform , ModalController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { LoginComponent } from '../components/login/login';


@Injectable()
export class AuthService {
  public authState: Observable<firebase.User>;

  FB_APP_ID: number = 1825311747740641;

  user: any;

  constructor(public afAuth: AngularFireAuth, private platform: Platform, public modalCtrl: ModalController,
              private fb: Facebook) {

    this.fb.browserInit(this.FB_APP_ID, "v2.8");

    this.authState = afAuth.authState;
    
  }

  get authenticated(): boolean {
    return this.afAuth.auth.currentUser !== null;
  }

  getUid(): string{
    return this.afAuth.auth.currentUser.uid;
  }

  getUser(): any{
    return this.afAuth.auth.currentUser;
  }

  isLogedIn(): Promise<any> {

      return new Promise<boolean>((resolve, reject) => {

         if (!this.authenticated){

             //open login pop up
             let profileModal = this.modalCtrl.create(LoginComponent);
             profileModal.onDidDismiss(data => {

               data.completed ? resolve(true) : reject();

             });
             profileModal.present();


         }
         else
           resolve(true);
        
    });
  }


  signOut(): any{

     this.afAuth.auth.signOut();

  }
  





}