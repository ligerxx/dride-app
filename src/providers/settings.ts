import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Settings provider.

  This provider will get the setting JSON from dride.

*/
@Injectable()
export class Settings {


  constructor(public http: Http) {

  	console.log('Hello from Settings Provider');

  }

  public data: any;

	load(host: string) {
	  if (this.data) {
	    // already loaded data
	    return Promise.resolve(this.data);
	  }

	  // don't have the data yet
	  return new Promise(resolve => {

	    this.http.get( host +'/api/getSettings')
	      .map(res => res.json())
	      .subscribe(data => {
        
	        resolve(data);

	      });
	  });
	}

	setSettings(configObj: any, host: string, fieldName: string, fieldValue: string, CategoryName: string) {

	  // don't have the data yet
	  return new Promise(resolve => {

	    this.http.get( host +'/api/setSetting?fieldName=' + fieldName + '&fieldValue=' + fieldValue + '&CategoryName=' + CategoryName)
	      .map(res => res.json())
	      .subscribe(data => {
        
	        resolve(data);
	        
	      });
	  });
	}

}
