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

  myCart = [];
  grandTotal:any;
  totalItems: number = 0;
  totalPrice: any;

  constructor(
    public utils: UtilsProviderService,
    private navCtrl: NavController,
    private dataHelper: DataHelperService
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.loadCartData().then(() => {
      this.calculateTotal();
    });
  }

  async loadCartData() {
    return new Promise<void>((resolve) => {
      let products = JSON.parse(localStorage.getItem('myCart'));
      this.myCart = products || [];
      resolve();
    });
  }

  removeItemFromCart(selectedProduct) {
    this.dataHelper.removeItem(selectedProduct, 'myCart');
    this.ionViewWillEnter();
  }

  calculateTotal() {
    this.totalItems = this.myCart.length;
    this.totalPrice = 0;

    this.myCart.forEach(element => {
      this.totalPrice += element.price;
    });
    console.log('Intermediate Total Price:', this.totalPrice);

    this.totalPrice = Number(this.totalPrice.toFixed(2));
    console.log('Final Total Price:', this.totalPrice);
    this.grandTotal = this.totalPrice + 5;
  }


  orderPlaced() {
    this.utils.createToast('Order has been placed successfully!');
    this.navCtrl.navigateRoot(['/home']);
  }
}
