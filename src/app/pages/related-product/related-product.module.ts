import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RelatedProductPageRoutingModule } from './related-product-routing.module';
import { RelatedProductPage } from './related-product.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    RelatedProductPageRoutingModule
  ],
  declarations: [RelatedProductPage]
})
export class RelatedProductPageModule { }
