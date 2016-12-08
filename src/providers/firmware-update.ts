import { Injectable } from '@angular/core';
import { Transfer } from 'ionic-native';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Globals } from '../providers/globals';

/*
  Generated class for the FirmwareUpdate provider.

  Will update dride's firmware from gitHub releases
*/

@Injectable()
export class FirmwareUpdate {


	public host: string;

	//TODO make the version of firmware dynamic!
	public latest: string = '0.1.1';
	public firmwareZip: any;


	constructor(public http: Http, public g: Globals) {
		
		this.host = g.host;
	}


	updateDride(){

		//get the latest firmware from gitHub release.
		this.getLatestFirmware();

	}

	getLatestFirmware() {

   		const fileTransfer = new Transfer();

	    let url =  'https://github.com/dride/dride-ws/archive/'+ this.latest +'.zip';
	    fileTransfer.download(url, cordova.file.dataDirectory + 'tmpSharedClips.').then((entry) => {
	      console.log('download complete: ' + entry.toURL());

	      this.uploadToDride(entry.toURL());

	    }, (error) => {
	      // handle error
	      console.log(error);
	    });

	}



	uploadToDride(zipUrl){


		alert("xxxxxxx");



	}




}
