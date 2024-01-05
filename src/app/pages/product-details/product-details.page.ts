import { Component, OnInit } from '@angular/core';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { HttpHelperService } from 'src/app/services/http-helper.service';
import { ToastController } from '@ionic/angular';


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

  constructor(    public dataHelper: DataHelperService,
    public httpHelper: HttpHelperService,
    private toastController: ToastController) { }

  ngOnInit() {
  }
  async addToWishlist() {
    // Ensure the user is logged in
    if (this.dataHelper.currentUser && this.dataHelper.currentUser.uid) {
      // Get the current product details
      const currentProduct = this.dataHelper.productDetails;
  
      // Check if the product is not already in the wishlist
      if (!this.isProductInWishlist(currentProduct)) {
        // Add the product to the user's wishlist
        this.dataHelper.currentUser.wishlist = this.dataHelper.currentUser.wishlist || [];
        this.dataHelper.currentUser.wishlist.push(currentProduct);
  
        // Update the user's data on Firebase
        this.dataHelper.updateDataOnFirebase(`users/${this.dataHelper.currentUser.uid}`, {
          wishlist: this.dataHelper.currentUser.wishlist
        });
  
        // Display a success message
        this.presentToast('Product added to wishlist');
        console.log('Product added to wishlist:', currentProduct);
      } else {
        // Display a message indicating that the product is already in the wishlist
        this.presentToast('Product is already in the wishlist');
        console.log('Product is already in the wishlist:', currentProduct);
      }
    } else {
      // Display a message indicating that the user is not logged in
      this.presentToast('User not logged in');
      console.log('User not logged in');
    }
  }

  async addToCart() {
    // Ensure the user is logged in
    if (this.dataHelper.currentUser && this.dataHelper.currentUser.uid) {
      // Get the current product details
      const currentProduct = this.dataHelper.productDetails;

      // Check if the product is not already in the cart
      if (!this.isProductInCart(currentProduct)) {
        // Add the product to the user's cart
        this.dataHelper.currentUser.cart = this.dataHelper.currentUser.cart || [];
        this.dataHelper.currentUser.cart.push(currentProduct);

        // Update the user's data on Firebase
        this.dataHelper.updateDataOnFirebase(`users/${this.dataHelper.currentUser.uid}`, {
          cart: this.dataHelper.currentUser.cart
        });

        // Display a success message
        this.presentToast('Product added to cart');
        console.log('Product added to cart:', currentProduct);
      } else {
        // Display a message indicating that the product is already in the cart
        this.presentToast('Product is already in the cart');
        console.log('Product is already in the cart:', currentProduct);
      }
    } else {
      // Display a message indicating that the user is not logged in
      this.presentToast('User not logged in');
      console.log('User not logged in');
    }
  }

  
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duration in milliseconds
      position: 'top' // You can change the position (top, middle, bottom)
    });
    toast.present();
  }

  // Helper method to check if the product is already in the wishlist
  isProductInWishlist(product: any): boolean {
    return (
      this.dataHelper.currentUser.wishlist &&
      this.dataHelper.currentUser.wishlist.some((wishlistItem: any) => wishlistItem.id === product.id)
    );
  }

      // Helper method to check if the product is already in the cart
      isProductInCart(product: any): boolean {
        return (
          this.dataHelper.currentUser.cart &&
          this.dataHelper.currentUser.cart.some((cartItem: any) => cartItem.id === product.id)
        );
      }

}
