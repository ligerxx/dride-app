import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Globals } from '../providers/globals';

/*
  Generated class for the VideoService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class VideoService {

	public host: string;
	public data: any;

	constructor(public http: Http, public g: Globals) {

		this.host = g.host;

		console.log('Hello VideoService Provider');
	}

	load() {
	  if (this.data) {
	    // already loaded data
	    return Promise.resolve(this.data);
	  }

	  // don't have the data yet
	  return new Promise(resolve => {

	    this.http.get( this.host + '?custom=1&cmd=3015')
	      .map(res => {console.log(res)})
	      .subscribe(data => {

	        this.data = data;
	        
	        resolve(this.data);
	      });
	  });
	}

	delete(videoId) {

	  // don't have the data yet
	  return new Promise(resolve => {

	    this.http.get( this.host + '/api/deleteClip/' + videoId)
	      .map(res => res.json())
	      .subscribe(data => {

	        this.data = data.data;
	        
	        resolve(this.data);
	      });
	  });
	}



}
