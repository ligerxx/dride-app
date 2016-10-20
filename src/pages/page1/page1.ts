import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {


  public data: any;

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


  load() { 
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      this.http.get('https://agentloan.com.ge/agentLoan/4/giveOffer.php')
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data = data;
          resolve(this.data);
        });
    });
  }


  constructor(public navCtrl: NavController, public http: Http) {
      this.load()
      .then(data => {
        console.log(data)
      });
      }

}
