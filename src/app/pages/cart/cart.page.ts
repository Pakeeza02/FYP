import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilsProviderService } from 'src/app/services/utils-provider.service';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { iProduct } from 'src/app/models/product';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cartItems: iProduct[] = [];

  constructor(
    public utils: UtilsProviderService,
    private navCtrl: NavController,
    private dataHelper: DataHelperService
  ) {}

  ngOnInit() {
    // Fetch cart items when the page is initialized
    this.cartItems = this.dataHelper.currentUser.cart || [];
  }

  orderPlaced() {
    this.utils.createToast('Order has been placed successfully!');
    this.navCtrl.navigateRoot(['/home']);
  }
}
