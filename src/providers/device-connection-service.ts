import { Injectable } from '@angular/core';
import { Platform , ModalController } from 'ionic-angular';
import { Facebook, StatusBar } from 'ionic-native';
import { ConnectDrideComponent } from '../components/connect-dride/connect-dride';

/*
  Generated class for the DeviceConnectionService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DeviceConnectionService {

  constructor(public modalCtrl: ModalController) {
    console.log('Hello DeviceConnectionService Provider');
  }


  isConnected() {

      return new Promise<boolean>((resolve, reject) => {

         if (!this.isOnline()){

         	 console.log('open!');
             //open login pop up
             let profileModal = this.modalCtrl.create(ConnectDrideComponent);
             profileModal.onDidDismiss(data => {

               resolve(true)

             });
             StatusBar.backgroundColorByHexString('#333333'); // set status bar to black
             profileModal.present();


         }
         else
           resolve(true);
        
    });
  }

  isOnline(){

  	return false;
  
  }

}
