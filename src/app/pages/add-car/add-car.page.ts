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
    this.price = this.dataHelper.vehicleDetails.carPrice ?? 1;
    this.carInfoForm = this.formBuilder.group({
      vehicleName: [this.dataHelper.vehicleDetails.vehicleName, Validators.compose([
        Validators.required
      ])],
      vehicleDescription: [this.dataHelper.vehicleDetails.vehicleDescription, Validators.compose([
        Validators.required
      ])],
      vehicleModel: [this.dataHelper.vehicleDetails.vehicleModel, Validators.compose([
        Validators.required
      ])],
      vehicleCompany: [this.dataHelper.vehicleDetails.vehicleCompany, Validators.compose([
        Validators.required
      ])],
      vehicleRegYear: [this.dataHelper.vehicleDetails.vehicleRegYear, Validators.compose([
        Validators.required
      ])],
      carburant: [this.dataHelper.vehicleDetails.carburant, Validators.compose([
        Validators.required
      ])],
      transmission: [this.dataHelper.vehicleDetails.transmission, Validators.compose([
        Validators.required
      ])],
      location: [this.dataHelper.vehicleDetails.location, Validators.compose([
        Validators.required
      ])],
      registrationNumber: [this.dataHelper.vehicleDetails.registrationNumber, Validators.compose([
        Validators.required
      ])],
      mileage: [this.dataHelper.vehicleDetails.mileage, Validators.compose([
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

  // Save the vehicle information and navigate to the next step
  saveVehicleInfo() {
    const formData = this.carInfoForm.value;
    this.dataHelper.vehicleDetails.carPrice = this.price;
    this.dataHelper.vehicleDetails = { ...this.dataHelper?.vehicleDetails, ...formData };
    this.navCtrl.navigateForward(['/upload-car']);
  }

}