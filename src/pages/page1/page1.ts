import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import {VideoService} from '../../providers/video-service';


@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html',
  providers: [ VideoService ]
})


export class Page1 {


  public data: any;
  //public host: string = "http://192.168.2.2"; 
  public host: string = "http://192.168.42.1"; 
  public videos: any;

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

 

  constructor(public navCtrl: NavController, public videoService: VideoService) {

      this.videoService.load(this.host)
      .then(data => {
        this.videos = data
        console.log(this.videos)
      }); 



   }

}
