import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { iCategory } from 'src/app/models/category';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { UserAuthService } from 'src/app/services/user-auth.service';

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
  allCategories: iCategory[] = [];

  constructor(
    public dataHelper: DataHelperService,
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
    console.log(this.dataHelper.allCategories)
  }


  ngOnInit(): void {

  }

}