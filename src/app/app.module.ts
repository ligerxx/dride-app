import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from '../providers/auth-service';
import { DeviceConnectionService } from '../providers/device-connection-service';
import { Globals } from '../providers/globals';


import { clipsPage } from '../pages/clipsPage/clipsPage';
import { SettingsPage } from '../pages/settings/settings';
import { CloudPage, KeysPipe } from '../pages/cloud/cloud';
import { CloudPaginationService } from '../pages/cloud/cloud-pagination.service';
import { LivePage } from '../pages/live/live';


import { FirmwareUpdatePage } from '../pages/firmware-update-page/firmware-update-page';
import { CalibrationPage } from '../pages/calibration/calibration';
import { ManualCalibration } from '../pages/manual-calibration/manual-calibration';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { VideoEditor } from '@ionic-native/video-editor';
import { Dialogs } from '@ionic-native/dialogs';
import { GooglePlus } from '@ionic-native/google-plus';
import { Firebase } from '@ionic-native/firebase';
import { Toast } from '@ionic-native/toast';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BLE } from '@ionic-native/ble';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { MomentModule } from 'angular2-moment';
import { ElasticModule } from 'angular2-elastic';


//videogular2
import {VgCoreModule} from 'videogular2/core';
import {VgControlsModule} from 'videogular2/controls';
import {VgOverlayPlayModule} from 'videogular2/overlay-play';
import {VgBufferingModule} from 'videogular2/buffering';

//components
import { LoginComponent } from '../components/login/login';
import { ConnectDrideComponent } from '../components/connect-dride/connect-dride';
import { UploadPage } from '../components/upload/upload';

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
    UploadPage,
    CloudPage,
    CalibrationPage,
    LoginComponent,
    ConnectDrideComponent,
    KeysPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    MomentModule,
    IonicModule.forRoot(MyApp, {
      mode: 'ios'
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule, 
    AngularFireAuthModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    ElasticModule,
    BrowserAnimationsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    clipsPage,
    UploadPage,
    CloudPage,
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
              Globals,
              SplashScreen,
              StatusBar,
              Facebook,
              Dialogs,
              GooglePlus,
              Firebase,
              Toast,
              Transfer,
              File,
              VideoEditor,
              SocialSharing,
              InAppBrowser,
              BLE,
              LocalNotifications,
              CloudPaginationService
             ]
})
export class AppModule {}


