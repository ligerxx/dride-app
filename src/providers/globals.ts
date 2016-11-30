import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Globals {

	public host: string = "http://192.168.42.1:9000"; 

}
