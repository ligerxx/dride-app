import { Injectable } from '@angular/core';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
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
	public firmwareZip: any;


	constructor(public http: Http, public g: Globals, private transfer: Transfer, private file: File) {
		
		this.host = g.host;

	}


	updateDride(){

		//get the latest firmware from gitHub release.
		this.getLatestFirmware();

	}

	getLatestFirmware() {
		return new Promise((resolve, reject) => {

	   		const fileTransfer: TransferObject = this.transfer.create();

		    let url =  'https://s3.amazonaws.com/dride/releases/cardigan/latest.zip';

		    fileTransfer.download(url, this.file.dataDirectory + 'latest.zip').then((entry) => {
		      console.log('download complete: ' + entry.toURL());
		      resolve(entry.toURL());

		    }, (error) => {
		      // handle error
		      console.log(error);
		      reject();
		    });
	  });
	}



	uploadFirmwareToDride(zipUrl){
		return new Promise((resolve, reject) => {

			const fileTransfer: TransferObject = this.transfer.create();
		  let options: FileUploadOptions = {
		     fileKey: 'file',
		     fileName: 'latest.zip'
		  }

		  fileTransfer.upload(zipUrl, this.host + '/api/updateFirmware', options)
		   .then((data) => {
		     // success
		     console.log(data)
		     resolve(data);
		   }, (err) => {
		     // error
		     reject(err);
		   })
		


			

		  });


	}




}
