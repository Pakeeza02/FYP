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
import { AllReviewsComponent } from './all-reviews/all-reviews.component';
import { AddProductComponent } from './add-product/add-product.component';
import { AddPromoComponent } from './add-promo/add-promo.component';
import { AddBrandComponent } from './add-brand/add-brand.component';
import { AddCategoryComponent } from './add-category/add-category.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    HeaderComponent,
    ImgSliderComponent,
    AddProductComponent,
    AddPromoComponent,
    AddCategoryComponent,
    AddBrandComponent,
    FooterComponent,
    ProductListingComponent,
    CategoriesComponent,
    RecommendedProductsComponent,
    BrandsComponent,
    AllReviewsComponent,
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
    AllReviewsComponent,
    AddProductComponent,
    AddCategoryComponent,
    AddPromoComponent,
    AddBrandComponent,
    ProductListingComponent,
    CategoriesComponent,
    BrandsComponent
  ]
})
export class ComponentsModule { }
