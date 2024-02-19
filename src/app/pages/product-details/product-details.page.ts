import { Component, OnInit } from '@angular/core';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { HttpHelperService } from 'src/app/services/http-helper.service';
import { ToastController } from '@ionic/angular';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { iProduct } from 'src/app/models/product';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {

  imgUrls: string[] = [
    "https://rukminim2.flixcart.com/image/850/1000/xif0q/smartwatch/t/h/3/49-ultra-8-smartwatch-with-bluetooth-calling-best-smartwatch-original-imaghrpuyxb6hjkg.jpeg?q=90",
    "https://m.media-amazon.com/images/I/71Cv9lpxuiL._AC_UF1000,1000_QL80_.jpg"
  ];

  productDetail: iProduct;

  constructor(public dataHelper: DataHelperService,
    public httpHelper: HttpHelperService,
    private toastController: ToastController,
    public userAuth: UserAuthService) {
    this.productDetail = this.dataHelper.productDetails;
  }

  ngOnInit() {
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duration in milliseconds
      position: 'top' // You can change the position (top, middle, bottom)
    });
    toast.present();
  }

  isProductInWishlist(selectedProduct) {
    const wishListProducts = JSON.parse(localStorage.getItem('wishList')) || [];
    const index = wishListProducts.findIndex(x => x.id === selectedProduct.id);
    return index >= 0;
  }

  addWishlist(product) {
    const wishListProducts = JSON.parse(localStorage.getItem('wishList')) || [];
    console.log('Existing Wishlist:', wishListProducts);
    // Check if the product is already in the wishlist
    const index = wishListProducts.findIndex(x => x.id === product.id);

    if (index === -1) {
      // Product not in wishlist, add it
      wishListProducts.push(product);
      localStorage.setItem('wishList', JSON.stringify(wishListProducts));
      console.log('Updated Wishlist:', wishListProducts);
    } else {
      // Product is already in the wishlist, handle accordingly (maybe show a message)
      console.log('Product is already in the wishlist');
    }
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
