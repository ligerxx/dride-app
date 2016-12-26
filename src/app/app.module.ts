import { NgModule, ErrorHandler} from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AuthService } from '../providers/auth-service';
import { DeviceConnectionService } from '../providers/device-connection-service';
import { Globals } from '../providers/globals';


import { clipsPage } from '../pages/clipsPage/clipsPage';
import { SettingsPage } from '../pages/settings/settings';
import { CalibrationPage } from '../pages/calibration/calibration';

//components
import { LoginComponent } from '../components/login/login';
import { ConnectDrideComponent } from '../components/connect-dride/connect-dride';


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
    LoginComponent,
    ConnectDrideComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      mode: 'ios'
    }),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    clipsPage,
    SettingsPage,
    CalibrationPage,
    LoginComponent,
    ConnectDrideComponent
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, 
              AuthService,
              LoginComponent,
              DeviceConnectionService,
              ConnectDrideComponent,
              Globals
             ]
})
export class AppModule {}


