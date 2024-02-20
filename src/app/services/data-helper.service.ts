import { Injectable } from '@angular/core';
import { iChatNode } from '../models/chat';
import { iUser } from '../models/user';
import { UtilsProviderService } from './utils-provider.service';
import { Subject } from 'rxjs';
import firebase from 'firebase';
import { iFilter } from '../models/filter';
import { AlertController, NavController } from '@ionic/angular';
import { iProduct } from '../models/product';
import { iCategory } from '../models/category';
import { iBrand } from '../models/brand';

@Injectable({
  providedIn: 'root'
})
export class DataHelperService {

  productDetails: iProduct = new iProduct();
  myChats: iChatNode[] = [];
  selectedChat: iChatNode;
  displayLoading: boolean;
  allproducts: iProduct[] = [];
  selectedCategory: iCategory;
  showInfoSavedPopup: boolean;
  registrationYear: number[] = [];
  carCompany: string[] = ['Toyota', 'Honda', 'Suzuki', 'KIA', 'Hyundai', 'Nissan', 'Mitsubishi', 'Mercedes-Benz', 'Audi', 'BMW',];
  carModels: string[] = ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Sportage', 'Hyundai Tucson', 'Nissan Sunny', 'Mitsubishi Mirage', 'Mercedes-Benz C-Class', 'Audi A3', 'BMW 3 Series'];
  userType: string;
  allProducts: iProduct[] = [];
  firebaseStorageUrl = 'https://firebasestorage';
  appliedFilters: iFilter;
  userAvatar = 'assets/images/profile.jpg'
  fooSubject = new Subject<any>();
  allUsers: any = {};
  currentUser: iUser = new iUser();
  productFetched: boolean;
  allBrands: iBrand[] = []
  allCategories: iCategory[] = [];

  constructor(
    public utils: UtilsProviderService,
    public navCtrl: NavController,
    public alertController: AlertController
  ) {
    if (localStorage.getItem('userLoggedIn')) {
      // this.utils.presentLoading();
      this.fetchAllData();
    }
    // Initialize the registrationYear array from 1990 to the current year
    const currentYear = new Date().getFullYear();
    for (let i = 1990; i <= currentYear; i++) {
      this.registrationYear.push(i);
    }
  }

  // Fetch all user and product data when the service is constructed
  fetchAllData() {
    this.getAllUsers();
    this.getAllProducts();
    this.getAllCategories();
    this.getAllBrands();
  }


  addWishlist(product) {
    if (this.isProductInWishlist(product)) {
      this.removeItem(product, 'wishList');
    } else {
      const wishlistProducts = JSON.parse(localStorage.getItem('wishList')) || [];
      const index = wishlistProducts.findIndex(x => x.id === product.id);
      if (index < 0) {
        wishlistProducts.push(product);
        localStorage.setItem('wishList', JSON.stringify(wishlistProducts));
      }
      this.displayToastMsg('Alert', 'This product has been added to wishlist successfully!');
    }
  }

  async displayToastMsg(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
      mode: 'ios',
    });
    await alert.present();
  }

  isProductInWishlist(selectedProduct) {
    const wishListProducts = JSON.parse(localStorage.getItem('wishList')) || [];
    const index = wishListProducts.findIndex(x => x.id === selectedProduct.id);
    return index >= 0;
  }

  addToCart(product) {
    const myCart = JSON.parse(localStorage.getItem('myCart')) || [];
    const index = myCart.findIndex(x => x.id === product.id);
    if (index < 0) {
      myCart.push(product);
      localStorage.setItem('myCart', JSON.stringify(myCart));
    }
    this.displayToastMsg('Alert', 'This product has been added to your cart successfully!');
  }

  removeItem(selectedProduct, storageType: string) {
    const wishListProducts = JSON.parse(localStorage.getItem(storageType)) || [];
    const index = wishListProducts.findIndex(x => x.id === selectedProduct.id);
    wishListProducts.splice(index, 1);
    localStorage.setItem(storageType, JSON.stringify(wishListProducts));
    const message = storageType === 'myCart' ? 'cart!' : 'wishlist';
    this.displayToastMsg('Alert', `This product has been removed from your ${message}`);
  }

  getAllUsers() {
    this.getFirebaseData('users')
      .then((snapshot) => {
        this.allUsers = snapshot?.val() ?? {};
        this.getCurrentUser();
        this.utils.stopLoading()
      });
  }

  getCurrentUser() {
    const uid = localStorage.getItem('uid');
    this.getFirebaseData(`/users/${uid}`)
      .then((snapshot) => {
        const currentUser: iUser = snapshot.val() || {};
        this.allUsers[uid] = currentUser;
        localStorage.setItem('user', JSON.stringify(currentUser));
        this.publishSomeData({ updateLocalUser: true });
      });
  }

  getAllCategories() {
    const urlPath = 'categories';
    this.getFirebaseData(urlPath)
      .then((snapshot) => {
        this.allCategories = [];
        const allCategories = snapshot?.val() ?? {};
        for (const key in allCategories) {
          this.allCategories.push(allCategories[key]);
        }
        this.publishSomeData({ allCategoriesFetched: true });
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }

  getAllBrands() {
    const urlPath = 'brands';
    this.getFirebaseData(urlPath)
      .then((snapshot) => {
        console.log('Firebase Snapshot:', snapshot.val()); // Log the snapshot value
        this.allBrands = [];
        const allBrands = snapshot?.val() ?? {};
        for (const key in allBrands) {
          this.allBrands.push(allBrands[key]);
        }
        this.publishSomeData({ allBrandsFetched: true });
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }

  getAllProducts() {
    const urlPath = 'products';
    this.getFirebaseData(urlPath)
      .then((snapshot) => {
        console.log('Firebase Snapshot:', snapshot.val()); // Log the snapshot value
        this.allProducts = [];
        const allProducts = snapshot?.val() ?? {};
        for (const key in allProducts) {
          this.allProducts.push(allProducts[key]);
        }
        this.publishSomeData({ allProductsFetched: true });
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }

  // Retrieve the current user's chats from Firebase
  getMyChats() {
    const myUid = localStorage.getItem('uid');
    this.getFirebaseData('chats')
      .then((snapshot) => {
        this.myChats = [];
        const data = snapshot.val() || {};
        for (const key in data) {
          const chatNode: iChatNode = data[key];
          if (chatNode.clientUid === myUid || chatNode.hostUid === myUid) {
            this.myChats.push(chatNode);
          }
        }
        this.publishSomeData({ myChatsFetched: true });
      });
  }

  // Asynchronously fetch data from a Firebase path
  async getFirebaseData(urlPath: string): Promise<any> {
    try {
      return firebase.database().ref().child(urlPath)
        .once('value', (snapshot) => {
          return snapshot;
        });
    } catch (err) {
      this.utils.stopLoading();
      this.utils.createToast(err.message);
    }
  }

  // Asynchronously update data on a Firebase path
  async updateDataOnFirebase(urlPath: string, data: any): Promise<any> {
    try {
      const resp = await firebase.database().ref().child(urlPath).set(data);
      return resp;
    } catch (e) {
      this.utils.stopLoading();
      this.utils.createToast(e.message);
    }
  }

  deepCloneData(data: any): any {
    if (data) {
      return JSON.parse(JSON.stringify(data));
    }
  }

  // Publish data to the Subject for observers to react
  publishSomeData(data: any) {
    this.fooSubject.next(data);
  }

  // Get an observable for the Subject
  getObservable(): Subject<any> {
    return this.fooSubject;
  }

}