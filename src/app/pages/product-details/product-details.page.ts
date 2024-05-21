import { Component, OnInit } from '@angular/core';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { NavController, ToastController } from '@ionic/angular';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { iProduct } from 'src/app/models/product';
import { InboxPage } from 'src/app/pages/inbox/inbox.page';

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
              private toastController: ToastController,
              private navCtrl: NavController,
              public userAuth: UserAuthService) {
    this.productDetail = this.dataHelper.productDetails;

    // Ensure the productDetail has imageUrls assigned if not already
    if (!this.productDetail.imageUrls || this.productDetail.imageUrls.length === 0) {
      this.productDetail.imageUrls = this.imgUrls;
    }
  }

  ngOnInit() {}

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  isProductInWishlist(selectedProduct: iProduct): boolean {
    const wishListProducts: iProduct[] = JSON.parse(localStorage.getItem('wishList')) || [];
    return wishListProducts.some(product => product.productId === selectedProduct.productId);
  }

  addWishlist(product: iProduct) {
    const wishListProducts: iProduct[] = JSON.parse(localStorage.getItem('wishList')) || [];
    console.log('Existing Wishlist:', wishListProducts);

    const index = wishListProducts.findIndex(x => x.productId === product.productId);

    if (index === -1) {
      wishListProducts.push(product);
      localStorage.setItem('wishList', JSON.stringify(wishListProducts));
      console.log('Updated Wishlist:', wishListProducts);
      this.presentToast('Product added to wishlist');
    } else {
      console.log('Product is already in the wishlist');
      this.presentToast('Product is already in the wishlist');
    }
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
  
  contactSeller(sellerUid: string, productId: string) {
    // Navigate to the InboxPage and pass the seller's UID and product ID
    this.navCtrl.navigateForward(`/inbox/${sellerUid}/${productId}`);
  }

}
