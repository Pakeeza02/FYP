import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { iCategory } from 'src/app/models/category';
import { HttpHelperService } from 'src/app/services/http-helper.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  allCategories: iCategory[] = [];

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
        this.toastr.success("category saved successfully!");
      });
  }

}
