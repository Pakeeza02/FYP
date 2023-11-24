import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllBrandsPageRoutingModule } from './all-brands-routing.module';

import { AllBrandsPage } from './all-brands.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    AllBrandsPageRoutingModule
  ],
  declarations: [AllBrandsPage]
})
export class AllBrandsPageModule {}
