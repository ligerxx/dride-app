import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import {InAppBrowser} from 'ionic-native';

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

  constructor(public modalCtrl: ModalController) {

      setTimeout(() => {
        this.isLoaded =true;
      }, 1000);


  }


  buyDride(){

    let browser = new InAppBrowser('https://dride.io/buy', '_system');

  }



}


