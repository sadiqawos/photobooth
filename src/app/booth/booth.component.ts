import { Component, OnInit, NgZone, ViewChild, HostListener } from '@angular/core';
import { CameraService } from '../services/camera.service';
import { FacebookService } from '../services/facebook.service';
import { PrintService } from '../services/print.service';
import { FormControl, Validators } from '@angular/forms';
import { ConfigService } from '../services/config.service';

export enum KEY_CODE {
  ENTER = 13,
  SPACE_BAR = 32
}

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
  images = [];
  printers = [];
  cameras = [];
  config;
  @ViewChild('file') file;

  constructor(
    private _cameraService: CameraService,
    private _ngZone: NgZone,
    private _facebook: FacebookService,
    private _printService: PrintService,
    private _config: ConfigService) {
    this.config = _config.getConfig();
  }

  ngOnInit() {
    this._cameraService.init(cameras => {
      this.cameras = cameras;
    });
    this.printers = this._printService.getPrinters();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.SPACE_BAR) { // reset and start

      // This means we are waiting to print something
      if (this.images.length > 0) {
        this.resetState();
      }
      this.startTimer();
    } else if (event.keyCode === KEY_CODE.ENTER) { // print
      this.print();
    }
  }

  startTimer(): any {
    if (this.timer.isActive) {
      return;
    }
    this.timer.isActive = true;

    this.timer.id = setInterval(() => {
      if (this.timer.value > 1) {
        this.timer.value--;
      } else {
        clearInterval(this.timer.id);
        this.timer.value = null;
        // Send shutter release command
        this._cameraService.takePhoto((err, file) => {
          if (err) {
            console.error(err);
            this.resetState();
            return;
          }

          // update ui
          this._ngZone.run(() => {
            // reset ui/hide countdown 
            this.resetState();
            
            // display new image 
            this.images.push({ src: file });
          });
        }, this._config.getSaveDir(), 3);
      }
    }, 1000);
  }

  resetTimer(): any {
    this.timer = {
      isActive: false,
      value: 5,
      id: null
    }
  }

  print() {
    if (this.hide || this.images.length < 1) {
      return; // another print is in-progress or no images to print
    }
    //hide elements we dont want to print
    this.hide = true;

    // print
    this._printService.print((success: boolean) => {
      this._ngZone.run(() => {
        // unhide elements
        this.hide = false;
        this.resetState();
      });
    }, this._config.getPrinterName());
  }

  resetState(): any {
    this.resetTimer();
    this.images.length = 0;
  }

  selectPrinter(name) {
    this._config.setPrinterName(name);
  }

  fbLogin() {
    this._facebook.getToken(token => {
      this._config.setFacebookToken(token);
    });
  }

  saveConfig() {
    this._config.save();
  }

  onDirSelected() {
    const files: { [key: string]: File } = this.file.nativeElement.files;

    if (files && files[0]) {
      this._config.setSaveDir(files[0].path);
    }
  }
}
