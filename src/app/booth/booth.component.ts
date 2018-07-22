import { Component, OnInit, NgZone } from '@angular/core';
import { CameraService } from '../services/camera.service';
import { FacebookService } from '../services/facebook.service';
import { PrintService } from '../services/print.service';

@Component({
  selector: 'app-booth',
  templateUrl: './booth.component.html',
  styleUrls: ['./booth.component.css']
})
export class BoothComponent implements OnInit {
  timer = {
    isActive: false,
    value: 5,
    id: null
  };

  hide = false;

  sampleImage = { src: "/home/sadiq/Workspace/photobooth/public/IMG_20180504_090308.jpg" };

  images = [];

  constructor(
    private _cameraService: CameraService,
    private _ngZone: NgZone,
    private _facebook: FacebookService,
    private _printService: PrintService) {}

  ngOnInit() {
    this._cameraService.init();
    this.resetTimer();
  }

  startTimer(): any {
    if (this.timer.isActive) {
      return;
    }
    this.timer.isActive = true;

    this.timer.id = setInterval(() => {
      if (this.timer.value > 1) {
        this.timer.value --;
      } else {
        // Send shutter release command to python code
        this._cameraService.takePhoto(file => {
          this._ngZone.run(() => {
            this.images.push({src: file});
            this.images.push({src: file});
            this.images.push({src: file});
          });
        }, 3);
        clearInterval(this.timer.id);
        this.resetTimer();
      }
    }, 1000);
  }

  resetTimer(): any {
    this.timer = {
      isActive: false,
      value: 5,
      id: null
    }
    this.images.length = 0; //clear all images
    this.images.push(this.sampleImage);
  }
  
  print() {
    this.hide = true;
    this._printService.print((success: boolean) => {
      this.hide = false;
    });
  }

  fbLogin() {
    this._facebook.getToken();
  }
}
