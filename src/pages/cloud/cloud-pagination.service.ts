import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


@Injectable()
export class CloudPaginationService {

	busy: boolean = false;
	before: string = "";
	end: boolean = false;
	public uid: string;
	items: FirebaseListObservable<any>;

	constructor(private http: Http, db: AngularFireDatabase) {
		this.busy = false;



	}
	loadUid(uid) {
		this.uid = uid;
		this.nextPage();
	}

	nextPage = function () {

		if (this.busy || this.end) return;
		this.busy = true;
		this.items = this.db.list('/clips/' + this.uid, {
			preserveSnapshot: true,
			query: {
				limitToLast: 10,
				orderByKey: true
			}
		})
		this.items.subscribe(snapshots => {
			snapshots.forEach(snapshot => {

				let data = snapshot.val();

				console.log(data)


				var itemsFromFB = this.reverseObject(data);
				for (var item in itemsFromFB) {
					//if we dont have a thumb or a clip skip

					if (!itemsFromFB[item] || !itemsFromFB[item].thumbs) continue;

					itemsFromFB[item].videoId = item

					// if (items[item].comments)
					//     items[item].comments = {};

					this.items.push(itemsFromFB[item]);
					this.after = itemsFromFB[item].hpInsertTime;

				}

				this.busy = false;

				if (this.after == this.before) {
					this.end = true;
					return;
				}

				this.before = this.after;



			},
				error => {
					this.end = true
					//TODO: log this
					console.log("An error occurred when requesting cloud clips.");
				}

			)
		});

	};

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
