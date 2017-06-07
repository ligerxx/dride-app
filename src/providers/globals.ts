import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';

@Injectable()
export class Globals {

public host: string; 

constructor(public platform: Platform) {

	if (this.platform.is('cordova'))
		this.host = "http://192.168.42.1:9000"; 
	else
		this.host = "http://192.168.2.2:9000"; 


}





}
