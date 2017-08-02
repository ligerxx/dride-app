import { Injectable } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';  
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Firebase } from '@ionic-native/firebase';
import Raven from 'raven-js';

Raven  
.config('https://486d6171a51743d895bf5e6faecbce85@sentry.io/198699',
        { 
            release: '0.2.5', 
            dataCallback: data => {

                if (data.culprit) {
                    data.culprit = data.culprit.substring(data.culprit.lastIndexOf('/'));
                }

                var stacktrace = data.stacktrace || 
                                 data.exception && 
                                 data.exception.values[0].stacktrace;

                if (stacktrace) {
                    stacktrace.frames.forEach(function (frame) {
                        frame.filename = frame.filename.substring(frame.filename.lastIndexOf('/'));
                    });
                }
            } 
        })
.install();

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
          Raven.captureException(error.originalError || error);
        }
        catch(e) {
          console.error(e);
        }

        try {
          this.firebase.logError(error.originalError || error);
        }
        catch(e) {
          console.error(e);
        }
    }

}
