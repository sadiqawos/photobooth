import { Component, OnInit, NgZone, ViewChild, HostListener } from '@angular/core';
import { CameraService } from '../services/camera.service';
import { FacebookService } from '../services/facebook.service';
import { PrintService } from '../services/print.service';
import { FormControl, Validators } from '@angular/forms';
import { ConfigService } from '../services/config.service';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
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
    this._cameraService.init();
    this.printers = this._printService.getPrinters();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.SPACE_BAR) {
      this.startTimer();
    }
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
        // Send shutter release command
        clearInterval(this.timer.id);
        this._cameraService.takePhoto((err, file) => {
          if (err) {
            console.error(err);
            this.resetTimer();
            return;
          }
          // update ui
          this._ngZone.run(() => {
            this.images.push({src: file});
            this.hide = true;
          });

          // print
          this._printService.print((success: boolean) => {
            this.hide = false;
          }, this._config.getPrinterName());

          // reset ui
          this.resetTimer();
        }, 3);
      }
    }, 1000);
  }

  resetTimer(): any {
    this.timer = {
      isActive: false,
      value: 5,
      id: null
    }
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
