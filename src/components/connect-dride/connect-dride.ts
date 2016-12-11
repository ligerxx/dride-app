import { Component, Injectable } from '@angular/core';
import { Platform , ModalController } from 'ionic-angular';
import { StatusBar } from 'ionic-native';


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


}


