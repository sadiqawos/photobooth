import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  config: object;
  constructor() {
    let config = localStorage.getItem('config');
    
    this.config = config ? JSON.parse(config) : {};
  }

  getFacebookToken(): string {
    return this.config['facebookToken'];
  }

  setFacebookToken(token: string): void {
    this.config['facebookToken'] = token;
    this.save();
  }

  getPrinterName(): string {
    return this.config['selectedPrinter'];
  }

  setPrinterName(name: string) {
    this.config['selectedPrinter'] = name;
    this.save();
  }

  setSaveDir(dirName: string) {
    this.config['autoSaveDir'] = dirName;
    this.save();
  }

  getSaveDir(): string {
    return this.config['autoSaveDir'];
  }
  
  getConfig() {
    return this.config;
  }

  save() {
    localStorage.setItem('config', JSON.stringify(this.config));
  }
}
