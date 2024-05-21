import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { iProduct } from 'src/app/models/product'; // Assuming you have a product interface

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
})
export class WishlistPage implements OnInit {
  wishListProducts: iProduct[] = []; // Use the iProduct interface

  constructor(public dataHelper: DataHelperService, public toastController: ToastController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    let products = JSON.parse(localStorage.getItem('wishList'));
    this.wishListProducts = products || [];
  }

  removeItemFromWishlist(selectedProduct: iProduct) {
    this.dataHelper.removeItem(selectedProduct, 'wishList');
    this.presentToast('Product removed from wishlist');
    this.ionViewWillEnter();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  addToCart(product: iProduct) {
    const cartProducts: iProduct[] = JSON.parse(localStorage.getItem('myCart')) || [];
    const index = cartProducts.findIndex(x => x.productId === product.productId);

    if (index === -1) {
      cartProducts.push(product);
      localStorage.setItem('myCart', JSON.stringify(cartProducts));
      this.presentToast('Product added to cart');
    } else {
      this.presentToast('Product is already in the cart');
    }
  }
}
