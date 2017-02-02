import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { ConnectDrideComponent } from '../components/connect-dride/connect-dride';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Globals } from '../providers/globals';

/*
  Generated class for the DeviceConnectionService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DeviceConnectionService {

  public connectModal: any;

  constructor(public modalCtrl: ModalController, public g: Globals, public http: Http) {
    console.log('Hello DeviceConnectionService Provider');
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
             this.connectModal.dismiss();
           }
        });

        
    });
  }


    isOnline(){

      // don't have the data yet
      return new Promise(resolve => {

        //if we didn't receive a response than we're not connected!
        setTimeout(() => {


          resolve(false);
          console.log('kill connection');
          con.unsubscribe();
          
        }, 2000);
            
        let con = this.http.get( this.g.host +'/api/isOnline')
          .map(res => res.json())
          .timeout(2000)
          .subscribe(
            data => {


                if (data.status){
                  resolve(true);
                  return;
                }
                
              }
              );
            


      });
    
    }

}
