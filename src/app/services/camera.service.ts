import { Injectable } from '@angular/core';
const gphoto2 = (<any>window).require("gphoto2");
const path = (<any>window).require("path");
const im = (<any>window).require('imagemagick');
const fs = (<any>window).require('fs');

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

  init(callback = null) {
    if (!this.isInit) {
      this.GPhoto.list(function (list) {
        if (callback) {
          callback(list);
        }
        if (list.length === 0) return;
        let camera = list[0];
        CameraService.camera = camera;
        // Set configuration values
        camera.setConfigValue('capturetarget', 1, function (er) {
          if (er) {
            console.error(er);
          }
          this.isInit = true;
          console.log('Camera Detected')
        });
      });
    }
  }

  takePhoto(callback, outDir) {
    if (!CameraService.camera) {
      this.init(cameras => {
        if (cameras.length === 0) {
          return callback('Camera not initialized');
        }
        this.clickShutter(callback, outDir);
      });
      return;
    }
    this.clickShutter(callback, outDir);
  }

  clickShutter(callback, outDir) {
    let dir = outDir ? outDir : path.join(__dirname, '/../../public/');
    let fileName = Math.round(new Date().getTime() / 1000) + '.jpg';
    let file = path.join(dir, fileName);

    CameraService.camera.takePicture({ download: true }, function (er, data) {
      if (er) {
        return callback(er);
      }
      fs.writeFile(file, data, function (err) {
        if (err) {
          return callback(err);
        }
        if (callback) callback(undefined, file);
      });
    });
  }
}
