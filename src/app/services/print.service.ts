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
   * @param printerName
   */
  print(callback, printerName: string = null) {
    let window = this._electronService.remote.getCurrentWebContents();
    let defaultPrinter = this.getPrinters().find(f => {
      return f.isDefault;
    });
    window.print({
      silent: true,
      deviceName: printerName || defaultPrinter.name
    }, callback);
  }

  /**
   * returns a list of printers
   */
  getPrinters(): Electron.PrinterInfo[] {
    return this._electronService.remote.getCurrentWebContents().getPrinters();
  }
}
