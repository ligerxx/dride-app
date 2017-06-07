import { Injectable, Component } from '@angular/core';
import { ModalController, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { ConnectDrideComponent } from '../components/connect-dride/connect-dride';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Globals } from '../providers/globals';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { BLE } from '@ionic-native/ble';
import { LocalNotifications } from '@ionic-native/local-notifications';


declare var bluetoothle: any;

/*
  Generated class for the DeviceConnectionService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DeviceConnectionService {

  public connectModal: any;
  public af: AngularFire;
  public isOnlineB: boolean;
  public serviceUUID: string;
  public characteristicUUID: string;


  constructor(public modalCtrl: ModalController, public g: Globals, public http: Http, af: AngularFire, private statusBar: StatusBar, public platform: Platform, private ble: BLE, private localNotifications: LocalNotifications) {
    this.af = af;

    this.isOnlineB = false;
    this.serviceUUID = '1234';
    this.characteristicUUID = '5678'

    console.log("Scanning Started");
    this.platform.ready().then(() => {


        setTimeout(this.scanBLE(), 3000);


     });



  }

  scanBLE(){
          console.log('startBLE')

          this.ble.isEnabled().then(res =>{
              console.log('status')
              console.log(res)
          }, err =>{
            console.log('err!')
            console.log(err)
            this.ble.enable();
          })
          

          this.ble.startScan([this.serviceUUID]).subscribe(device => {
       
                // if we're in the background, add a local notification
                var localNotification = {
                    title: 'Dride is paired',
                    text: 'Make sure to connect to the dride WIFI network'
                };

                // stop scanning and connect automatically
                if (device.name == 'dride' || device.name == 'raspberrypi'){
                  
                  this.localNotifications.schedule(localNotification);

                      console.log("try to connect")
                      this.ble.connect(device.id).subscribe(con => {

                        console.log("con")
                        console.log(con)

                        //send timestamp to device
                        var timestamp = parseInt( (new Date).getTime()/1000  + '') + '';
                        //7787 is the serviceUUID for time update
                        //9997 is the characteristicUUID time update
                        this.ble.write(device.id, '7787', '9997', this.stringToBytes(timestamp)).then(res => {
                          console.log('res')
                          console.log(res)
                        },err => {
                          console.log('err')
                          console.log(err)
                        })

                        this.ble.startNotification(device.id, this.serviceUUID, this.characteristicUUID).subscribe(buffer => {

                            console.log("onData");
                            var data = new Uint32Array(buffer);
                            console.log(data[0]);

                            var localNotification = {
                                title: 'Uploading video..',
                                text: 'Click here to share this video with your friends'
                            };

                            this.localNotifications.schedule(localNotification);

                        })


                      }, err => {

                        console.log('Error connecting to device', err);

                        console.log('reconnecting..');
                        this.scanBLE();
                      });



              }



          },
            err => {
              console.log('Error scanning for Bluetooth devices')
            });

  }

  stringToBytes(string: any ) {
     var array = new Uint8Array(string.length);
     for (var i = 0, l = string.length; i < l; i++) {
         array[i] = string.charCodeAt(i);
      }
     return array.buffer;
  }


  isConnected(withPopUp: boolean) {



      return new Promise<boolean>((resolve, reject) => {

        this.isOnline().then(resp => {
            

           if (!resp){

               //open login pop up
               if (withPopUp){
                 this.connectModal = this.modalCtrl.create(ConnectDrideComponent);

                 this.statusBar.backgroundColorByHexString('#333333'); // set status bar to black
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
                this.makeSureDeviceIsRegistered()
                resolve(true);
                return;
              }
              
            }
            );

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
