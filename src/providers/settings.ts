import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Globals } from '../providers/globals';


/*
  Generated class for the Settings provider.

  This provider will get the setting JSON from dride.

*/
@Injectable()
export class Settings {


  public data: any;
  public host: string;
  
  constructor(public http: Http, public g: Globals) {

    this.host = g.host;

  }


	load() {

	  if (this.data) {
	    // already loaded data
	    return Promise.resolve(this.data);
	  }

	  // don't have the data yet
	  return new Promise(resolve => {

	    this.http.get( this.host +'/api/getSettings')
	      .map(res => res.json())
	      .subscribe(data => {
        
	        resolve(data);

	      });
	  });
	}

	setSettings(fieldName: string, fieldValue: string, CategoryName: string) {


	  // don't have the data yet
	  return new Promise(resolve => {

	    this.http.get( this.host +'/api/setSetting?fieldName=' + fieldName + '&fieldValue=' + fieldValue + '&CategoryName=' + CategoryName)
	      .map(res => res.json())
	      .subscribe(data => {
        
	        resolve(data);
	        
	      });
	  });
	}






}
