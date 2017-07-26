import { Injectable } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';  
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Firebase } from '@ionic-native/firebase';

/*
  Generated class for the ErrorLoggerProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ErrorLoggerProvider extends IonicErrorHandler{

    constructor(private firebase: Firebase) { 
      super()
    }


    handleError(error) {
        super.handleError(error);

        try {
          this.firebase.logError(error.originalError || error);
        }
        catch(e) {
          console.error(e);
        }
    }

}
