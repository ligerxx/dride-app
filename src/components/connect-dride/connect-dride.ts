import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';


/*
  Generated class for the ConnectDride component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'connect-dride',
  templateUrl: 'connect-dride.html'
})
export class ConnectDrideComponent {

  public isLoaded: boolean = false;

  constructor(public modalCtrl: ModalController, private iab: InAppBrowser) {

      setTimeout(() => {
        this.isLoaded =true;
      }, 1000);


  }

  buyDride(){

    const browser = this.iab.create('https://dride.io/store', '_system');

  }



}


