import { Injectable } from '@angular/core';
const fs = (<any>window).require("fs");
const gphoto2 = (<any>window).require("gphoto2");
const path = (<any>window).require("path");

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  GPhoto;
  static camera;
  isInit = false;

  constructor() {
    this.GPhoto = new gphoto2.GPhoto2();
  }

  init() {
    if (!this.isInit) {
      this.GPhoto.list(function (list) {
        if (list.length === 0) return;
        let camera = list[0];
        CameraService.camera = camera;
        console.log('Camera Found:', camera.model);

        // get configuration tree
        camera.getConfig(function (er, settings) {
        });

        // Set configuration values
        camera.setConfigValue('capturetarget', 1, function (er) {
          this.isInit = true;
        });
      });
    }
  }

  takePhoto(callback, burst = 0) {
    if (!CameraService.camera) {
      console.error('Camera not initialized');
      return;
    }
    // Take picture with camera object obtained from list()
    CameraService.camera.takePicture({ download: true }, function (er, data) {
      let fileName = Math.round(new Date().getTime() / 1000) + '.jpg';
      let file = path.join(__dirname, '/../../public/', fileName);
      fs.writeFileSync(file, data);
      if (callback) callback(file);
    });
  }
}
