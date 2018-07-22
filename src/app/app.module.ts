import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BoothComponent } from './booth/booth.component';

import { NgxElectronModule } from 'ngx-electron';
import { CameraService } from './services/camera.service'

import { ModalModule } from 'ngx-bootstrap/modal';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
  declarations: [
    AppComponent,
    BoothComponent
  ],
  imports: [
    BrowserModule,
    AngularFontAwesomeModule,
    NgxElectronModule,
    ModalModule.forRoot(),
  ],
  providers: [CameraService],
  bootstrap: [AppComponent]
})
export class AppModule { }
