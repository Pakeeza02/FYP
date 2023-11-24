import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UtilsProviderService } from 'src/app/services/utils-provider.service';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.page.html',
  styleUrls: ['./add-car.page.scss'],
})
export class AddCarPage implements OnInit {

  maxPrice: number = 5000;
  price: number = 0;
  carInfoForm: FormGroup;

  constructor(
    public dataHelper: DataHelperService,
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    public utils: UtilsProviderService,
    public userAuth: UserAuthService
  ) {
    this.price = this.dataHelper.productDetails.carPrice ?? 1;
    this.carInfoForm = this.formBuilder.group({
      productName: [this.dataHelper.productDetails.productName, Validators.compose([
        Validators.required
      ])],
      productDescription: [this.dataHelper.productDetails.productDescription, Validators.compose([
        Validators.required
      ])],
      productModel: [this.dataHelper.productDetails.productModel, Validators.compose([
        Validators.required
      ])],
      productCompany: [this.dataHelper.productDetails.productCompany, Validators.compose([
        Validators.required
      ])],
      productRegYear: [this.dataHelper.productDetails.productRegYear, Validators.compose([
        Validators.required
      ])],
      carburant: [this.dataHelper.productDetails.carburant, Validators.compose([
        Validators.required
      ])],
      transmission: [this.dataHelper.productDetails.transmission, Validators.compose([
        Validators.required
      ])],
      location: [this.dataHelper.productDetails.location, Validators.compose([
        Validators.required
      ])],
      registrationNumber: [this.dataHelper.productDetails.registrationNumber, Validators.compose([
        Validators.required
      ])],
      mileage: [this.dataHelper.productDetails.mileage, Validators.compose([
        Validators.required
      ])],
    });
  }

  ngOnInit() { }

  // Format the price with a dollar sign
  pinFormatter(value: number) {
    return `$${value}`;
  }

  // Update the selected price
  updatePriceFilter(e: any) {
    this.price = e.detail.value.upper;
  }

  // Save the product information and navigate to the next step
  saveproductInfo() {
    const formData = this.carInfoForm.value;
    this.dataHelper.productDetails.carPrice = this.price;
    this.dataHelper.productDetails = { ...this.dataHelper?.productDetails, ...formData };
    this.navCtrl.navigateForward(['/upload-car']);
  }

}