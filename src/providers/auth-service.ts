import { Platform , ModalController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { AuthProviders, AngularFireAuth, FirebaseAuthState, AuthMethods } from 'angularfire2';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { StatusBar } from '@ionic-native/status-bar';
import { LoginComponent } from '../components/login/login';


@Injectable()
export class AuthService {
  public authState: FirebaseAuthState;

  FB_APP_ID: number = 1825311747740641;

  user: any;

  constructor(public auth$: AngularFireAuth, private platform: Platform, public modalCtrl: ModalController, public statusBar: StatusBar, private fb: Facebook) {

    this.fb.browserInit(this.FB_APP_ID, "v2.8");

    this.authState = auth$.getAuth();
    auth$.subscribe((state: FirebaseAuthState) => {
      this.authState = state;
    });
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  getUid(): string{
    return this.authState.uid;
  }

  isLogedIn(): Promise<any> {

      return new Promise<boolean>((resolve, reject) => {

         if (!this.authenticated){

             //open login pop up
             let profileModal = this.modalCtrl.create(LoginComponent);
             profileModal.onDidDismiss(data => {

               data.completed ? resolve(true) : reject(true);

             });
             this.statusBar.backgroundColorByHexString('#333333'); // set status bar to black
             profileModal.present();


         }
         else
           resolve(true);
        
    });
  }


  signOut(): any{

     this.auth$.logout();

  }
  





}