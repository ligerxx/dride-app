import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import {VideoService} from '../../providers/video-service';

import {Pipe, PipeTransform} from '@angular/core';


@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html',
  providers: [ VideoService ]
})


export class Page1 {


  public data: any;
  //public host: string = "http://192.168.2.2"; 
  public host: string = "http://192.168.42.1:9000"; 
  public videos: any;

  public vid: HTMLVideoElement;
  public playing: boolean[] = [];
  public progressBar: boolean[] = [];
  public progress: any = 50;

  
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 500);
  } 

  play(vidoeId) {

    this.vid = <HTMLVideoElement> document.getElementById('v' + vidoeId); 
    this.playing[vidoeId] = true;   
    this.vid.play();  
  }
  pause(vidoeId) {

    this.vid = <HTMLVideoElement> document.getElementById('v' + vidoeId); 
    this.playing[vidoeId] = false;
    this.vid.pause();

  }

 

  constructor(public navCtrl: NavController, public videoService: VideoService) {

      this.videoService.load(this.host)
      .then(data => {
        this.videos = data
      }); 



   }

}
