import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { DataHelperService } from 'src/app/services/data-helper.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
})
export class WishlistPage implements OnInit {
  wishListProducts: any[] = []; // Placeholder for wishlist items

  constructor(public dataHelper: DataHelperService, public toastController: ToastController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    let products = JSON.parse(localStorage.getItem('wishList'));
    this.wishListProducts = products || [];
  }

  removeItemFromWishlist(selectedProduct) {
    this.dataHelper.removeItem(selectedProduct, 'wishList');
    this.ionViewWillEnter();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duration in milliseconds
      position: 'top' // You can change the position (top, middle, bottom)
    });
    toast.present();
  }

  addToCart(product) {
    const cartProducts = JSON.parse(localStorage.getItem('myCart')) || [];
    const index = cartProducts.findIndex(x => x.id === product.id);

    if (index === -1) {
      cartProducts.push(product);
      localStorage.setItem('myCart', JSON.stringify(cartProducts));
      this.presentToast('Product added to cart');
    } else {
      // Product is already in the cart, handle accordingly (maybe show a message)
      console.log('Product is already in the cart');
    }
  }

}
