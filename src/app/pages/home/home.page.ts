import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { iFilter } from 'src/app/models/filter';
import { iProduct } from 'src/app/models/vehicle';
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

  // Array to store the user's products
  myproducts: iProduct[] = [];

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
  carDetails(car: iProduct) {
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
    this.dataHelper.productDetails = new iProduct();
    this.navCtrl.navigateForward(['/add-car']);
  }

  ngOnInit(): void {

  }

}