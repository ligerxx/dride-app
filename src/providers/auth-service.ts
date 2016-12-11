import { Platform , ModalController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { FirebaseAuth, FirebaseAuthState } from 'angularfire2';
import { Facebook, StatusBar } from 'ionic-native';
import { LoginComponent } from '../components/login/login';


@Injectable()
export class AuthService {
  public authState: FirebaseAuthState;

  FB_APP_ID: number = 1825311747740641;

  user: any;

  constructor(public auth$: FirebaseAuth, private platform: Platform, public modalCtrl: ModalController) {

    Facebook.browserInit(this.FB_APP_ID, "v2.8");

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
             StatusBar.backgroundColorByHexString('#333333'); // set status bar to black
             profileModal.present();


         }
         else
           resolve(true);
        
    });
  }

}