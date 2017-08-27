import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Config } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { clipsPage } from '../pages/clipsPage/clipsPage';
import { CloudPage } from '../pages/cloud/cloud';
import { SettingsPage } from '../pages/settings/settings';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = clipsPage;
  profileModal: any;

  pages: Array<{title: string, component: any}>;
 
  constructor(public platform: Platform,  public splashScreen: SplashScreen, public statusBar: StatusBar, private config: Config) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Main', component: clipsPage },
	  { title: 'My Videos', component: CloudPage },
      { title: 'Settings', component: SettingsPage }
    ];

  }


  initializeApp() {
    this.platform.ready().then(() => {

      this.statusBar.overlaysWebView(false); // let status bar overlay webview

      this.statusBar.backgroundColorByHexString('#333333'); // set status bar to green

      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.config.set('backButtonText', '');

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }


}


