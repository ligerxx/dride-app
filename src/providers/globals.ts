import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class Globals {

	public host: string = "http://192.168.42.1:9000"; 
	//public host: string = "http://192.168.2.7:9000"; 

}
