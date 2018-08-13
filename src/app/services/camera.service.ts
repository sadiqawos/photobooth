import { Injectable } from '@angular/core';
const gphoto2 = (<any>window).require("gphoto2");
const path = (<any>window).require("path");
const im = (<any>window).require('imagemagick');

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
          this.isInit = true;
        });
      });
    }
  }

  takePhoto(callback, outDir = null, burst = 0) {
    if (!CameraService.camera) {
      this.init(cameras => {
        if (cameras.length === 0) {
          return;
        }
        this.clickShutter(callback, outDir, burst);
      });
      return callback('Camera not initialized');
    }
    this.clickShutter(callback, outDir, burst);
  }

  clickShutter(callback, outDir, burst) {
    // Take picture with camera object obtained from list()
    CameraService.camera.takePicture({ download: true }, function (er, data) {
      if (er) {
        return callback(er);
      }
      let dir = outDir ? outDir : path.join(__dirname, '/../../public/');
      let fileName = Math.round(new Date().getTime() / 1000) + '.jpg';

      let file = path.join(dir, fileName);

      im.crop({
        srcData: data,
        dstPath: file,
        width: 2592,
        // height: 250,
        quality: 1,
        gravity: 'Center'
      }, function (err, stdout, stderr) {
        // fs.writeFileSync(file, data);
        if (callback) callback(undefined, file);
      });
    });
  }
}
