import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler} from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AuthService } from '../providers/auth-service';
import { DeviceConnectionService } from '../providers/device-connection-service';
import { Globals } from '../providers/globals';


import { clipsPage } from '../pages/clipsPage/clipsPage';
import { SettingsPage } from '../pages/settings/settings';
import { FirmwareUpdatePage } from '../pages/firmware-update-page/firmware-update-page';
import { CalibrationPage } from '../pages/calibration/calibration';
import { ManualCalibration } from '../pages/manual-calibration/manual-calibration';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { Firebase } from '@ionic-native/firebase';
import { Toast } from '@ionic-native/toast';

//components
import { LoginComponent } from '../components/login/login';
import { ConnectDrideComponent } from '../components/connect-dride/connect-dride';


export const firebaseConfig = {
  apiKey: 'AIzaSyDi0egNqUM-dZDjIiipjW-aSRYuXlFc3Ds',
  authDomain: 'dride-2384f.firebaseapp.com',
  databaseURL: 'https://dride-2384f.firebaseio.com',
  storageBucket: 'dride-2384f.appspot.com',
  messagingSenderId: "802741428178"
};


@NgModule({
  declarations: [
    MyApp,
    clipsPage,
    SettingsPage,
    FirmwareUpdatePage,
    CalibrationPage,
    ManualCalibration,
    LoginComponent,
    ConnectDrideComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
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
    FirmwareUpdatePage,
    CalibrationPage,
    ManualCalibration,
    LoginComponent,
    ConnectDrideComponent
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, 
              AuthService,
              LoginComponent,
              DeviceConnectionService,
              ConnectDrideComponent,
              Globals,
              SplashScreen,
              StatusBar,
              Facebook,
              GooglePlus,
              Firebase,
              Toast
             ]
})
export class AppModule {}


