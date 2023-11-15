import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarDetailPageRoutingModule } from './car-detail-routing.module';

import { CarDetailPage } from './car-detail.page';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarDetailPageRoutingModule
  ],
  declarations: [CarDetailPage]
})
export class CarDetailPageModule { }
