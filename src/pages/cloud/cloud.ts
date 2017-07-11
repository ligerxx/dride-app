import { Component, PipeTransform, Pipe } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { Http } from "@angular/http";

import firebase from 'firebase';


import { AuthService } from '../../providers/auth-service';
import { CloudPaginationService } from '../cloud/cloud-pagination.service';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Dialogs } from '@ionic-native/dialogs';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Firebase } from '@ionic-native/firebase';

import { VgAPI } from 'videogular2/core';

/**
 * Generated class for the CloudPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-cloud',
  templateUrl: 'cloud.html',
})
export class CloudPage {

  hpClips: any;
  public firebaseUser: any;
  public databaseURL: string = 'https://dride-2384f.firebaseio.com';
  public api: VgAPI;
  public replyBox: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, public af: AngularFireDatabase,
    private dCloud: CloudPaginationService, private _auth: AuthService, private afAuth: AngularFireAuth, private http: Http,
    private dialogs: Dialogs, private socialSharing: SocialSharing, private firebaseNative: Firebase, public actionSheetCtrl: ActionSheetController) {

    //load Firebase user object
    this._auth.isLogedIn().then(result => {


      this.hpClips = this.dCloud
      this.firebaseUser = this._auth.getUser();
      this.hpClips.loadUid(this.firebaseUser.uid);

    });



  }

  onPlayerReady(api: VgAPI) {
    this.api = api;

    this.api.getDefaultMedia().subscriptions.ended.subscribe(
      () => {
        // Set the video to the beginning
        this.api.getDefaultMedia().currentTime = 0;
      }
    );
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad CloudPage');
  }

  shareLink(videoId) {
    let url = "https://dride.io/profile/" + this.firebaseUser.uid + "/" + videoId;
    // Share via share sheet
    var options = {
      subject: 'Video from Dride-Cloud',
      url: url,
      chooserTitle: 'Share an event on Dride-Cloud' // Android only, you can override the default share sheet title
    }
    this.socialSharing.shareWithOptions(options).then(() => {
      // Success!
      this.firebaseNative.logEvent("video uploaded", { content_type: "share_video", item_id: "home" });

    }).catch(() => {
      // Error!
    });


  }

  isOwner(uid) {
    return uid && uid == this.firebaseUser.uid
  }


  removeClip = function (vId, index) {

    if (!this.firebaseUser.uid || !vId) {
      console.error('Error: No Uid or videoId, Delete aborted')
      return;
    }
    //TODO: prompt before remove

    //firebase functions will take it from here..
    this.db.object('/clips/' + this.firebaseUser.uid + '/' + vId).update({ 'deleted': true })


    this.hpClips.items.splice(index, 1)

  };

  commentFoucs = function (id) {
    document.getElementById(id).focus();
  }

  hasComments = function (comments) {
    return comments && Object.keys(comments).length ? true : false;
  };

  hasMoreToLoad = function (currentVideo) {

    if (!currentVideo.comments || typeof currentVideo.comments == "undefined")
      return false;

    return currentVideo &&
      currentVideo.cmntsCount >
      Object.keys(currentVideo.comments).length
      ? true
      : false;
  };
  loadMoreComments(videoId, index) {

    this.http
      .get(this.databaseURL + "/conversations_video/" + this.firebaseUser.uid + "/" + videoId + ".json")
      .map(response => response.json())
      .subscribe(data => {
        var items = data;
        this.hpClips.items[index].comments = items;
      },
      error => {
        //TODO: log this
        console.log("An error occurred when requesting comments.");
      }

      )


  };

  sendComment = function (videoId, body, index) {
    if (!body) {
      alert("Please write something");
      return;
    }

    this._auth.isLogedIn().then(result => {

      firebase
        .database()
        .ref("conversations_video")
        .child(this.firebaseUser.uid)
        .child(videoId)
        .push({
          autherId: this.firebaseUser.uid,
          auther: this.firebaseUser.displayName,
          pic: this.firebaseUser.photoURL,
          body: body,
          timestamp: new Date().getTime()
        })
        .then(r => {
          this.loadMoreComments(videoId, index);
          body = "";
          this.replyBox[index] = "";

          //this.bindVideoToLive(op, videoId, index);

        });
      //TODO: track
      //$mixpanel.track("posted a comment");
    })
  };

  presentActionSheet(videoId, index) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Video In The Cloud',
      buttons: [
        // {
        //   text: 'Show on map',
        //   handler: () => {
        //     alert('show map')
        //   }
        // },
        {
          text: 'Share',
          handler: () => {
            this.shareLink(videoId)
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.removeClip(videoId, index)
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

}


@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
  transform(value, args: string[]): any {
    let keys = [];
    for (let key in value) {
      keys.push(value[key]);
    }
    return keys;
  }
}