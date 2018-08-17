import { Component, OnInit, NgZone, ViewChild, HostListener, TemplateRef, ElementRef } from '@angular/core';
import { CameraService } from '../services/camera.service';
import { FacebookService } from '../services/facebook.service';
import { PrintService } from '../services/print.service';
import { FormControl, Validators } from '@angular/forms';
import { ConfigService } from '../services/config.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

export enum KEY_CODE {
  ENTER = 13,
  SPACE_BAR = 32,
  LEFT = 37,
  RIGHT = 39
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

  printCount = 1;
  shutterCount = 0;

  hide = false;
  images = [];
  printers = [];
  cameras = [];
  config;

  @ViewChild('file') file;
  @ViewChild('showPrint') showPrint : ElementRef;
  @ViewChild('printModal') printModal;

  constructor(
    private _cameraService: CameraService,
    private _ngZone: NgZone,
    private _facebook: FacebookService,
    private _printService: PrintService,
    private _config: ConfigService,
    private modalService: BsModalService) {
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
    // console.log(event.keyCode)
    if (event.keyCode === KEY_CODE.SPACE_BAR) { // reset and start
      if (this.printModal.isShown) {
        this.printModal.hide();
        this.print();
        return;
      }
      // This means we are waiting to print something
      if (this.images.length == 3 && !this.timer.isActive) {
        this.triggerFalseClick();
        return;
      }
      this.startTimer();
    } else if (event.keyCode === KEY_CODE.ENTER) {
      this.resetState();
      this.startTimer();
    } else if (event.keyCode === KEY_CODE.LEFT) {
      if (this.printCount > 1) {
        this.printCount--;
      }
    } else if (event.keyCode === KEY_CODE.RIGHT) {
      if (this.printCount < 5) {
        this.printCount++;
      }
    }
  }

  startTimer(overide = false): any {
    if (this.timer.isActive && !overide) {
      return;
    }
    this.timer.isActive = true;

    this.timer.id = setInterval(() => {
      if (this.timer.value > 1) {
        if (!this.timer.isActive) {
          clearInterval(this.timer.id);
        }
        this.timer.value--;
      } else {
        clearInterval(this.timer.id);
        // Send shutter release command
        this._cameraService.takePhoto((err, file) => {
          this._ngZone.run(() => {
            if (err) {
              console.error(err);
              this.resetState();
              return;
            }
            this.images.push({ src: file });
          });
        }, this._config.getSaveDir());

        if (this.shutterCount < 2) {
          this.timer.value = 5;
          this.shutterCount++;
          this.startTimer(true);
        } else {
          this.resetTimer();
        }
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
    if (this.hide) {
      return; // another print is in-progress or no images to print
    }
    this.hide = true;

    for (var i = 0; i < this.printCount; i++) {
      this._printService.print((success: boolean) => {
        if (i == (this.printCount)) {
          this._ngZone.run(() => {
            this.hide = false;
            this.resetState();
          });
        }
      }, this._config.getPrinterName());
    }
  }

  resetState(): any {
    this.resetTimer();
    if (this.timer.id) {
      clearInterval(this.timer.id);
      this.timer.id = null;
    }
    this.images.length = 0;
    this.shutterCount = 0;
    this.printCount = 1;
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

  triggerFalseClick() {
    let el: HTMLElement = this.showPrint.nativeElement as HTMLElement;
    el.click();
  }
}
