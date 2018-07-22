import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor(private _electronService: ElectronService) {
  }

  /**
   * Print the currently displayed web content
   * @param callback
   */
  print(callback) {
    let window = this._electronService.remote.getCurrentWebContents();

    window.print({
      silent: true,
      deviceName: 'Canon-MX470-series'
    }, callback);
  }

  /**
   * returns a list of printers
   */
  getPrinters(): Electron.PrinterInfo[] {
    return this._electronService.remote.getCurrentWebContents().getPrinters();
  }
}
