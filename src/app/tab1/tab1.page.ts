import { Component } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { iproduct } from '../models/product';
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

  // Array to store the user's products
  myproducts: iproduct[] = [];

  constructor(
    public dataHelper: DataHelperService,
    private modalCtrl: ModalController,
    public userAuth: UserAuthService,
    public navCtrl: NavController
  ) {
    // Subscribe to data changes to refresh the view when products are fetched
    this.dataHelper.getObservable().subscribe(data => {
      if (data.productsFetched) {
        this.getMyproducts();
      }
    });
  }

  // This method is called when the view will enter
  ionViewWillEnter() {
    this.getMyproducts();
  }

  // Get the user's products based on applied filters
  getMyproducts() {
    this.myproducts = this.dataHelper.filterproducts();
    if (this.dataHelper.userType === 'seller') {
      this.myproducts = this.myproducts.filter(x => x.hostUid === this.userAuth.currentUser.uid);
    }
  }

  // Handle the "pull to refresh" event
  doRefresh(event: any) {
    this.myproducts = [];
    setTimeout(() => {
      this.getMyproducts();
      event.target.complete();
    }, 500);
  }

  // Navigate to the car details page
  carDetails(car: iproduct) {
    this.dataHelper.productDetails = this.dataHelper.deepCloneData(car);
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
      this.getMyproducts();
    } else if (data.resetFilters) {
      this.dataHelper.appliedFilters = new iFilter();
      this.getMyproducts();
    }
  }

  // Navigate to the "add car" page to add a new product
  addNewproduct() {
    this.dataHelper.productDetails = new iproduct();
    this.navCtrl.navigateForward(['/add-car']);
  }

}