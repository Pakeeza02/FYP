import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { iFilter } from 'src/app/models/filter';
import { iVehicle } from 'src/app/models/vehicle';
import { FilterCarPage } from 'src/app/pages/filter-car/filter-car.page';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.scss'],
})
export class ProductListingComponent implements OnInit {

  myVehicles: iVehicle[] = [];

  products: any[] = [
    {
      coverImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoPfZlyqPSP9fYjWHNnHJvC5R6XiGspMJP9aFcSrtFpHpjf8LXNnjyjeDYRbOAc6Q00Fs&usqp=CAU',
      imgUrls: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDvooX2XG13ijmA_cIJsdkrkX_kMH8XgersRiCMZhjGrloR4CcM7fPlvueN6w5rNr6mWM&usqp=CAU",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4eXfqYvFmDZmumTndpUuQeZasBlobyOxzZmPgyR81bOG5N0D7Sb8hucAvudtXgND0ZRE&usqp=CAU",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoPfZlyqPSP9fYjWHNnHJvC5R6XiGspMJP9aFcSrtFpHpjf8LXNnjyjeDYRbOAc6Q00Fs&usqp=CAU",
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAxU9ybAPc5W39-8EUCwYJ6WMm1C--NK1-hm7d2-6yQePGaeTko1kPeHe0mmX6yL_mSIw&usqp=CAU'],
      title: "Special Diamond Decent Ring",
      price: '140',
      description: 'An exceptionally fine piece of jewelry that will elevate your look and add to your gracefulness to your personality. Stone used in the jewelry is real.'
    },
    {
      coverImage: 'https://media.wired.com/photos/6511aab1189c419c40374c92/1:1/w_1358,h_1358,c_limit/Apple-Watch-Ultra-2-Alt-Gear.jpg',
      imgUrls: [
        "https://rukminim2.flixcart.com/image/850/1000/xif0q/smartwatch/t/h/3/49-ultra-8-smartwatch-with-bluetooth-calling-best-smartwatch-original-imaghrpuyxb6hjkg.jpeg?q=90",
        "https://m.media-amazon.com/images/I/71Cv9lpxuiL._AC_UF1000,1000_QL80_.jpg"
      ],

      title: "Ultra Smart Watch Series 8",
      price: '270',
      description: 'T800 Ultra Product size?44*38*13mm CPU?YC1133 Flash?32M GPS/AGPS?NO G-sensor?YES M-sensor?YES Wifi:NO SIM:NO BT:5.0 LCD 1.99" TP:cob capacitance multi functionality.'
    },
    {
      coverImage: 'https://static-01.daraz.pk/p/0128449dc4e706c09a68bd1cc176c1d8.jpg',
      imgUrls: [
        "https://static-01.daraz.pk/p/d9a63a1e82c34affde16a3891ae72852.png",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS--qBaLKYn_6Ye0XCWGd0BTjjNAc-qoMD3rpIoGv2eF0kxTBbdbOkUbxxntJHwMseOcT8&usqp=CAU",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfRw9vWKbBqETuu-0C_weCcZppIsURqftur08hxZ90NGgFGBsezxMnDxV0cc6FIl6LllA&usqp=CAU",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYdB5-37Ot8x6d0ZjwKP185CUeiZLtlQ1rOcrb0tEF-Yqx8C1xRmXdHurCadXUP_AxZoQ&usqp=CAU"
      ],
      title: "Handbag For Girls",
      price: '180',
      description: 'Pearl Fancy Girl Mini Purse Pouch Shoulder Bags in Pakistan – Super cute Diamond Fancy Jelly hand bag phone sling bags with lock, in beautiful colors.'
    },
    {
      coverImage: 'https://static-01.daraz.pk/p/1b1122512e26d12a4166714c00020f2e.jpg',
      imgUrls: [
        "https://i5.walmartimages.com/asr/b270a77c-5975-46ba-9256-a70f06ccef98.796289c369e656166e95b2db98074850.jpeg",
        "https://ae03.alicdn.com/kf/S2fcbcea4865d4f8d975d68e8deeb1160R.jpg_640x640q90.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRfhbdOsKJEdY_yWga8Di4c9WB09OLTaqfHx0vwXGAF7zmnt9Yxx2KfApt76Lc7Go7Apc&usqp=CAU"
      ],
      title: "Matte Nail Polish Water-proof",
      price: '40',
      description: 'Shop nail polish with fast delivery and free shipping. This nail polish is easy to apply and soak off. Find products of Nail Polish with high quality.'
    },
  ]

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

  productDetail() {
    this.navCtrl.navigateForward(['/product-details']);
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

  ngOnInit(): void {

  }

}