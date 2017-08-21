import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


@Injectable()
export class CloudPaginationService {

	busy: boolean = false;
	before: string = "";
	end: boolean = false;
	public uid: string;
	fbLits: FirebaseListObservable<any>;
	items: any = [];
	itemsPool: any = [];
	constructor(private http: Http, public db: AngularFireDatabase) {
		this.busy = false;



	}
	loadUid(uid) {
		this.uid = uid;
		this.getClips();
	}

	getClips = function () {

		if (this.busy || this.end) return;
		this.busy = true;
		this.fbLits = this.db.list('/clips/' + this.uid, {
			preserveSnapshot: true,
			query: {
				orderByChild: "dateUploaded"
			}
		}).take(1)
		this.fbLits.subscribe(snapshots => {
			this.itemsPool = [];
			snapshots.forEach(snapshot => {

				let data = snapshot.val();


				var itemsFromFB = this.reverseObject(data);

				//if we dont have a thumb or a clip skip 
				if (!itemsFromFB || !itemsFromFB.thumbs || !itemsFromFB.clips || itemsFromFB.deleted) return;

				itemsFromFB.videoId = snapshot.key
				itemsFromFB.views = itemsFromFB.views ? itemsFromFB.views : '0'


				this.itemsPool.push(itemsFromFB);

			})
			
			for (var i = 0; i < this.itemsPool.length && this.itemsPool; i++) {
				
				let currentVideo = this.itemsPool.pop();
				this.items.push( currentVideo )

			}



		},
			error => {
				this.end = true
				//TODO: log this
				console.log("An error occurred when requesting cloud clips.");
			});

	};

	doInfinite(infiniteScroll) {
		return new Promise( (resolve, reject) => {
			for (var i = 0; i < 5 && this.itemsPool.length; i++) {
				let currentVideo = this.itemsPool.pop();
				
				this.items.push( currentVideo )

			}
			resolve()
		})
	}

	reverseObject(object) {
		var newObject = {};
		var keys = [];
		for (var key in object) {
			keys.push(key);
		}
		for (var i = keys.length - 1; i >= 0; i--) {
			var value = object[keys[i]];
			newObject[keys[i]] = value;
		}

		return newObject;
	}
}
