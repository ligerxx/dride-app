import { Component, PipeTransform, Pipe } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from "@angular/http";

import firebase from 'firebase';


import { AuthService } from '../../providers/auth-service';
import { CloudPaginationService } from '../cloud/cloud-pagination.service';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Dialogs } from '@ionic-native/dialogs';

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
  public replyBox:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, public af: AngularFireDatabase,
    private dCloud: CloudPaginationService, private _auth: AuthService, private afAuth: AngularFireAuth, private http: Http,
    private dialogs: Dialogs) {

    //load Firebase user object
    this._auth.isLogedIn().then(result => {


      this.hpClips = this.dCloud
      this.firebaseUser = this._auth.getUser();
      console.log(this.firebaseUser)
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
  fbShare = function (uid, videoId) {
    window.open(
      "https://www.facebook.com/sharer/sharer.php?u=https://dride.io/profile/" +
      uid +
      "/" +
      videoId,
      "Facebook",
      "toolbar=0,status=0,resizable=yes,width=" +
      500 +
      ",height=" +
      600 +
      ",top=" +
      (window.innerHeight - 600) / 2 +
      ",left=" +
      (window.innerWidth - 500) / 2
    );
  };
  twShare = function (uid, videoId) {
    var url = "https://dride.io/profile/" + uid + "/" + videoId;
    var txt = encodeURIComponent("You need to see this! #dride " + url);
    window.open(
      "https://www.twitter.com/intent/tweet?text=" + txt,
      "Twitter",
      "toolbar=0,status=0,resizable=yes,width=" +
      500 +
      ",height=" +
      600 +
      ",top=" +
      (window.innerHeight - 600) / 2 +
      ",left=" +
      (window.innerWidth - 500) / 2
    );
  };

  isOwner(uid) {
    return uid && uid == this.firebaseUser.uid
  }


  removeClip = function (op, vId, index) {

    if (!op || !vId) {
      console.error('Error: No Uid or videoId, Delete aborted')
      return;
    }
    //TODO: prompt before remove

    //firebase functions will take it from here..
    this.db.object('/clips/' + op + '/' + vId).update({ 'deleted': true })


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
    console.log(videoId)
    console.log(body)
    console.log(index)
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



}


@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    let keys = [];
    for (let key in value) {
      keys.push(value[key]);
    }
    return keys;
  }
}