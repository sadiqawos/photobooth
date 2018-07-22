import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BoothComponent } from './booth/booth.component';

import { NgxElectronModule } from 'ngx-electron';
import { CameraService } from './services/camera.service';
import { FacebookService } from './services/facebook.service';
import { PrintService } from './services/print.service';
import { ConfigService } from './services/config.service';

import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
  declarations: [
    AppComponent,
    BoothComponent
  ],
  imports: [
    BrowserModule,
    AngularFontAwesomeModule,
    FormsModule,
    NgxElectronModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot()
  ],
  providers: [CameraService, FacebookService, PrintService, ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule { }
