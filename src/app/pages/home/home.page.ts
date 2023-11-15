import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { iFilter } from 'src/app/models/filter';
import { iVehicle } from 'src/app/models/vehicle';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { FilterCarPage } from '../filter-car/filter-car.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  // Slide images for the slider component
  slideImages: string[] = [
    "../../../assets/images/banner.jpeg", "https://t4.ftcdn.net/jpg/03/83/21/91/360_F_383219100_WLHZFHSmz1GCfxEbPPNfR6MplgplaNLx.jpg"
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

  ngOnInit(): void {

  }

}