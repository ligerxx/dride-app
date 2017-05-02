import { Injectable, Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { ConnectDrideComponent } from '../components/connect-dride/connect-dride';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Globals } from '../providers/globals';
import {AngularFire, FirebaseListObservable} from 'angularfire2';


/*
  Generated class for the DeviceConnectionService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DeviceConnectionService {

  public connectModal: any;
  public af: AngularFire;

  constructor(public modalCtrl: ModalController, public g: Globals, public http: Http, af: AngularFire) {
    this.af = af;
  }


  isConnected(withPopUp: boolean) {



      return new Promise<boolean>((resolve, reject) => {

        this.isOnline().then(resp => {
            

           if (!resp){

               //open login pop up
               if (withPopUp){
                 this.connectModal = this.modalCtrl.create(ConnectDrideComponent);

                 StatusBar.backgroundColorByHexString('#333333'); // set status bar to black
                 this.connectModal.present();
                 
               }
               resolve(false);

           }
           else{
             resolve(true);
             if (this.connectModal)
               this.connectModal.dismiss();
           }
        });

        
    });
  }


    isOnline(){

      // don't have the data yet
      return new Promise(resolve => {

        resolve(true);


      });
    
    }


    makeSureDeviceIsRegistered(){

        let con = this.http.get( this.g.host +'/api/getSerialNumber')
          .map(res => res.json())
          .timeout(2000)
          .subscribe(
            data => {
                  const devices = this.af.database.object('devicesAll/' + data.serial);
                  devices.set({'lastSeen': (new Date).getTime()});               
              }
              );

      return true;


    }



}
