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

  myCart: iProduct[] = [];
  grandTotal: number = 0;
  totalItems: number = 0;
  totalPrice: number = 0;

  constructor(
    public utils: UtilsProviderService,
    private navCtrl: NavController,
    private dataHelper: DataHelperService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.loadCartData().then(() => {
      this.calculateTotal();
    });
  }

  async loadCartData() {
    return new Promise<void>((resolve) => {
      const products = JSON.parse(localStorage.getItem('myCart'));
      this.myCart = products || [];
      console.log('Cart Data:', this.myCart); // Log the cart data
      resolve();
    });
  }

  removeItemFromCart(selectedProduct: iProduct) {
    this.dataHelper.removeItem(selectedProduct, 'myCart');
    this.ionViewWillEnter();
  }

  calculateTotal() {
    this.totalItems = this.myCart.length;
    this.totalPrice = 0;
    
    // Sum up the prices of all items in the cart
    for (const item of this.myCart) {
      // Parse the price as a number before adding to totalPrice
      const itemPrice = parseFloat(item.price.toString());
      this.totalPrice += itemPrice;
    }
  
    // Calculate grandTotal after summing up totalPrice
    this.totalPrice = Number(this.totalPrice.toFixed(2));
    this.grandTotal = this.totalPrice + 5; // Assuming $5 is the fixed shipping cost
  }
  orderPlaced() {
    this.utils.createToast('Order has been placed successfully!');
    this.navCtrl.navigateRoot(['/home']);
  }
}
