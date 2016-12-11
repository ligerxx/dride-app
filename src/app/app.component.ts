import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { AngularFire } from 'angularfire2';



import { clipsPage } from '../pages/clipsPage/clipsPage';
import { SettingsPage } from '../pages/settings/settings';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = clipsPage;
  profileModal: any;

  pages: Array<{title: string, component: any}>;
 
  constructor(public platform: Platform, af: AngularFire) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Main', component: clipsPage },
      { title: 'Settings', component: SettingsPage }
    ];

  }


  initializeApp() {
    this.platform.ready().then(() => {

      StatusBar.overlaysWebView(false); // let status bar overlay webview

      StatusBar.backgroundColorByHexString('#90d7dc'); // set status bar to green

      StatusBar.styleDefault();
      Splashscreen.hide();

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }
}


