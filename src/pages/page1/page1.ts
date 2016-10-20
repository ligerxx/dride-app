import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {


  public users = [
    { name: 'Jilles', age: 21 },
    { name: 'Todd', age: 24 },
    { name: 'as', age: 18 },
    { name: 'Lidasdassa', age: 18 },
    { name: 'Lidasdassa', age: 18 },
    { name: 'Lidasdsadsa', age: 18 },
    { name: 'Liasdassa', age: 18 },
    { name: 'Lidasdassa', age: 18 },
    { name: 'Li23423sa', age: 18 },
    { name: 'Li34234sa', age: 18 }
  ];

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 500);
  }


  constructor(public navCtrl: NavController) {
    
  }

}
