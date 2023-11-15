import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FilterCarPageRoutingModule } from './filter-car-routing.module';

import { FilterCarPage } from './filter-car.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FilterCarPageRoutingModule
  ],
  declarations: [FilterCarPage]
})
export class FilterCarPageModule { }
