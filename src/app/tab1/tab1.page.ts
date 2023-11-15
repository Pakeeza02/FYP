import { Component } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { iVehicle } from '../models/vehicle';
import { ModalController, NavController } from '@ionic/angular';
import { FilterCarPage } from '../pages/filter-car/filter-car.page';
import { iFilter } from '../models/filter';
import { UserAuthService } from '../services/user-auth.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  // Slide images for the slider component
  slideImages: string[] = [
    "https://www.indianbluebook.com/themes/ibb/assets/images/home/banner3new.png"
  ];

  // Array to store the user's vehicles
  myVehicles: iVehicle[] = [];

  constructor(
    public dataHelper: DataHelperService,
    private modalCtrl: ModalController,
    public userAuth: UserAuthService,
    public navCtrl: NavController
  ) {
    // Subscribe to data changes to refresh the view when vehicles are fetched
    this.dataHelper.getObservable().subscribe(data => {
      if (data.vehiclesFetched) {
        this.getMyVehicles();
      }
    });
  }

  // This method is called when the view will enter
  ionViewWillEnter() {
    this.getMyVehicles();
  }

  // Get the user's vehicles based on applied filters
  getMyVehicles() {
    this.myVehicles = this.dataHelper.filterVehicles();
    if (this.dataHelper.userType === 'seller') {
      this.myVehicles = this.myVehicles.filter(x => x.hostUid === this.userAuth.currentUser.uid);
    }
  }

  // Handle the "pull to refresh" event
  doRefresh(event: any) {
    this.myVehicles = [];
    setTimeout(() => {
      this.getMyVehicles();
      event.target.complete();
    }, 500);
  }

  // Navigate to the car details page
  carDetails(car: iVehicle) {
    this.dataHelper.vehicleDetails = this.dataHelper.deepCloneData(car);
    this.navCtrl.navigateForward(['/car-detail']);
  }

  // Open the filter car modal
  async openFilters() {
    const modal = await this.modalCtrl.create({
      component: FilterCarPage,
      componentProps: {
        filters: this.dataHelper.appliedFilters || new iFilter()
      }
    });
    await modal.present();
    const data = (await modal.onWillDismiss()).data;
    if (data && data.filters) {
      this.dataHelper.appliedFilters = data.filters;
      this.getMyVehicles();
    } else if (data.resetFilters) {
      this.dataHelper.appliedFilters = new iFilter();
      this.getMyVehicles();
    }
  }

  // Navigate to the "add car" page to add a new vehicle
  addNewVehicle() {
    this.dataHelper.vehicleDetails = new iVehicle();
    this.navCtrl.navigateForward(['/add-car']);
  }

}