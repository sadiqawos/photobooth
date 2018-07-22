import { Injectable } from '@angular/core';
const FB = (<any>window).require("fb");
import { ElectronService } from 'ngx-electron';


@Injectable({
  providedIn: 'root'
})
export class FacebookService {
  clientId: string = '2134058110169721';
  redirectUrl: string = 'https://www.facebook.com/connect/login_success.html';

  constructor(private _electronService: ElectronService) {}

  init(token: string) {
    this.setAccessToken(token);
  }

  getToken(callback) {
    this._electronService.ipcRenderer.on('fb-token', (event, arg) => {
      let access_token = arg;
      callback(access_token);
    });

    this._electronService.ipcRenderer.send('fb-authenticate', {
      clientId: this.clientId,
      redirectUrl: this.redirectUrl
    });
  }

  private setAccessToken(access_token) {
    FB.setAccessToken(access_token);
  }

  testApi() {
    // FB.api('/me', { fields: ['id', 'name', 'picture.width(800).height(800)'] }, function (res) {
    //   console.log('name:', res.name);
    //   console.log('id:', res.id);
    //   console.log('pic_url:', res.picture.data.url);
    // });

    var body = 'Testing fb js sdk';
    FB.api('me/feed', 'post', { message: body }, function (res) {
      if (!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
      }
      console.log('Post Id: ' + res.id);
    });
  }
}
