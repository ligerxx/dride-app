import { Injectable } from '@angular/core';


@Injectable()
export class ConnectStateProvider {

  public _showPopupOnConnection = true;
  public link = false;
  constructor() {}

  showPopupOnConnection(state){ //true => open | false => closed
	  this._showPopupOnConnection = state;
  }

  getShowPopupOnConnection(){
	return this._showPopupOnConnection;
  }


  setLinkEstablished(link){
	this.link = link;
  }

  getLinkEstablished(){
	return this.link;
  }
}
