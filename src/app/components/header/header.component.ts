import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { iCategory } from 'src/app/models/category';
import { HttpHelperService } from 'src/app/services/http-helper.service';
import { ToastrService } from 'ngx-toastr';
import { iProduct } from 'src/app/models/vehicle';
import { AddProductComponent } from '../add-product/add-product.component';
import { iBrand } from 'src/app/models/brand';
import { AddBrandComponent } from '../add-brand/add-brand.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  allCategories: iCategory[] = [];
  allProduct: iProduct[] = [];
  allBrands: iBrand[] = []

  constructor(
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService,
    public route: Router,
    public httpHelper: HttpHelperService,
    public toastr: ToastrService
  ) { }

  ngOnInit() { }

  allProducts() {
    this.route.navigate(['/all-products'])
  }

  login() {
    this.route.navigate(['/login'])
  }

  wishlist() {
    this.route.navigate(['/wishlist'])
  }

  cart() {
    this.route.navigate(['/cart'])
  }

  addCategory(category = new iCategory()) {
    this.httpHelper.openSharedModal(AddCategoryComponent, 'category', category)
      .then((result: any) => {
        if (result && result.category) {
          this.saveCategoryOnFirebase(result.category);
          const index = this.allCategories.findIndex(x => x.categoryId === result.category.categoryId)
          index < 0 ? this.allCategories.push(result.category) : this.allCategories[index] = result.category;
        }
      });
  }

  saveCategoryOnFirebase(category: iCategory) {
    const urlPath = `categories/${category.categoryId}`;
    this.httpHelper.saveFirebaseData(urlPath, category)
      .then(() => {
        this.toastr.success("Category saved successfully!");
      });
  }

  addProduct(product = new iProduct()) {
    this.httpHelper.openSharedModal(AddProductComponent, 'product', product, 'xl')
      .then((result: any) => {
        if (result && result.product) {
          this.saveProductOnFirebase(result.product);
          const index = this.allProduct.findIndex(x => x.productId === result.product.productId)
          index < 0 ? this.allProduct.push(result.product) : this.allProduct[index] = result.product;
        }
      });
  }

  saveProductOnFirebase(product: iProduct) {
    const urlPath = `products/${product.productId}`;
    this.httpHelper.saveFirebaseData(urlPath, product)
      .then(() => {
        this.toastr.success("Product saved successfully!");
      });
  }

  addBrand(brand = new iBrand()) {
    this.httpHelper.openSharedModal(AddBrandComponent, 'brand', brand)
      .then((result: any) => {
        if (result && result.brand) {
          this.saveBrandOnFirebase(result.brand);
          const index = this.allBrands.findIndex(x => x.brandId === result.brand.brandId)
          index < 0 ? this.allBrands.push(result.brand) : this.allBrands[index] = result.brand;
        }
      });
  }

  saveBrandOnFirebase(brand: iBrand) {
    const urlPath = `brands/${brand.brandId}`;
    this.httpHelper.saveFirebaseData(urlPath, brand)
      .then(() => {
        this.toastr.success("Brand saved successfully!");
      });
  }

}