import { Injectable } from '@angular/core';
import { iChatNode } from '../models/chat';
import { iUser } from '../models/user';
import { UtilsProviderService } from './utils-provider.service';
import { Subject } from 'rxjs';
import firebase from 'firebase';
import { iFilter } from '../models/filter';
import { NavController } from '@ionic/angular';
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
    public navCtrl: NavController
  ) {
    if (localStorage.getItem('userLoggedIn')) {
      this.utils.presentLoading();
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

  // Retrieve all user data from Firebase
  getAllUsers() {
    this.getFirebaseData('users')
      .then((snapshot) => {
        this.allUsers = snapshot?.val() ?? {};
        this.getCurrentUser();
        this.utils.stopLoading()
      });
  }

  // Retrieve the current user's data from Firebase
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