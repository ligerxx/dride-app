import { NgModule, ErrorHandler} from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AuthService } from '../providers/auth-service';

import { clipsPage } from '../pages/clipsPage/clipsPage';
import { SettingsPage } from '../pages/settings/settings';
import { CalibrationPage } from '../pages/calibration/calibration';

//components
import { LoginComponent } from '../components/login/login';


export const firebaseConfig = {
  apiKey: 'AIzaSyDi0egNqUM-dZDjIiipjW-aSRYuXlFc3Ds',
  authDomain: 'dride-2384f.firebaseapp.com',
  databaseURL: 'https://dride-2384f.firebaseio.com',
  storageBucket: 'dride-2384f.appspot.com'
};


@NgModule({
  declarations: [
    MyApp,
    clipsPage,
    SettingsPage,
    CalibrationPage,
    LoginComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    clipsPage,
    SettingsPage,
    CalibrationPage,
    LoginComponent
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, 
              AuthService,
              LoginComponent
             ]
})
export class AppModule {}


