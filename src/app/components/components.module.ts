import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ImgSliderComponent } from './img-slider/img-slider.component';
import { FooterComponent } from './footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductListingComponent } from './product-listing/product-listing.component';
import { CategoriesComponent } from './categories/categories.component';
import { BrandsComponent } from './brands/brands.component';
import { RecommendedProductsComponent } from './recommended-products/recommended-products.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    HeaderComponent,
    ImgSliderComponent,
    FooterComponent,
    ProductListingComponent,
    CategoriesComponent,
    RecommendedProductsComponent,
    BrandsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    HeaderComponent,
    ImgSliderComponent,
    FooterComponent,
    RecommendedProductsComponent,
    ProductListingComponent,
    CategoriesComponent,
    BrandsComponent
  ]
})
export class ComponentsModule { }
