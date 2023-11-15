import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadCarPageRoutingModule } from './upload-car-routing.module';

import { UploadCarPage } from './upload-car.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadCarPageRoutingModule
  ],
  declarations: [UploadCarPage]
})
export class UploadCarPageModule {}
