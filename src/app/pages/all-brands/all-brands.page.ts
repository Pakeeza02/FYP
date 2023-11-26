import { Component, OnInit } from '@angular/core';
import { AddBrandComponent } from 'src/app/components/add-brand/add-brand.component';
import { iBrand } from 'src/app/models/brand';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { HttpHelperService } from 'src/app/services/http-helper.service';
import { ToastrService } from 'ngx-toastr';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-all-brands',
  templateUrl: './all-brands.page.html',
  styleUrls: ['./all-brands.page.scss'],
})
export class AllBrandsPage implements OnInit {

  allBrands: iBrand[] = []

  constructor(
    public httpHelper: HttpHelperService,
    public dataHelper: DataHelperService,
    public toastr: ToastrService,
    public userAuth: UserAuthService,
  ) { }

  ngOnInit() {
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
