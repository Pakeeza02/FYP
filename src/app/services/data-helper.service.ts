import { Injectable } from '@angular/core';
import { iChatNode } from '../models/chat';
import { iUser } from '../models/user';
import { UtilsProviderService } from './utils-provider.service';
import { Subject } from 'rxjs';
import firebase from 'firebase';
import { iProduct } from '../models/vehicle';
import { iFilter } from '../models/filter';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DataHelperService {

  productDetails: iProduct = new iProduct();
  myChats: iChatNode[] = [];
  selectedChat: iChatNode;
  displayLoading:boolean;
  allproducts: iProduct[] = [];
  showInfoSavedPopup: boolean;
  registrationYear: number[] = [];
  carCompany: string[] = ['Toyota', 'Honda', 'Suzuki', 'KIA', 'Hyundai', 'Nissan', 'Mitsubishi', 'Mercedes-Benz', 'Audi', 'BMW',];
  carModels: string[] = ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Sportage', 'Hyundai Tucson', 'Nissan Sunny', 'Mitsubishi Mirage', 'Mercedes-Benz C-Class', 'Audi A3', 'BMW 3 Series'];
  userType: string;
  allCars: iProduct[] = [];
  firebaseStorageUrl = 'https://firebasestorage';
  appliedFilters: iFilter;
  userAvatar = 'assets/images/profile.jpg'
  fooSubject = new Subject<any>();
  allUsers: any = {};
  currentUser: iUser = new iUser();
  productsFetched: boolean;

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
    this.getAllproducts();
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

  // Retrieve all product data from Firebase
  getAllproducts() {
    this.productsFetched = false;
    this.getFirebaseData('products')
      .then((snapshot) => {
        this.allproducts = [];
        const products = snapshot.val() || {};
        for (const key in products) {
          const product: iProduct = products[key];
          this.allproducts.push(product);
        }
        this.utils.stopLoading();
        this.getMyChats();
        this.productsFetched = true;
        this.publishSomeData({ productsFetched: true });
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

  // Apply filters to the list of products and return the filtered list
  filterproducts() {
    const filters = this.appliedFilters;
    if (!filters) {
      return this.allproducts;
    }

    let filteredproducts: iProduct[] = this.allproducts;

    if (filters?.minPrice) {
      filteredproducts = filteredproducts.filter(x =>
        Number(x?.carPrice) >= Number(filters?.minPrice) && Number(x?.carPrice) <= Number(filters?.maxPrice)
      );
    }

    if (filters?.minMileage) {
      filteredproducts = filteredproducts.filter(x =>
        Number(x?.mileage) >= Number(filters?.minMileage) && Number(x?.mileage) <= Number(filters?.maxMileage)
      );
    }

    if (filters?.minYear) {
      filteredproducts = filteredproducts.filter(x =>
        Number(x?.productRegYear) >= Number(filters?.minYear) && Number(x?.productRegYear) <= Number(filters?.maxYear)
      );
    }

    if (filters.company !== 'all') {
      filteredproducts = filteredproducts.filter(x =>
        x.productCompany.toLowerCase() === filters.company.toLowerCase()
      );
    }

    if (filters.model !== 'all') {
      filteredproducts = filteredproducts.filter(x =>
        x.productModel?.toLowerCase() === filters.model.toLowerCase()
      );
    }

    if (filters.carburant !== 'all') {
      filteredproducts = filteredproducts.filter(x =>
        x.carburant.toLowerCase() === filters.carburant.toLowerCase()
      );
    }

    if (filters.transmission !== 'all') {
      filteredproducts = filteredproducts.filter(x =>
        x.transmission.toLowerCase() === filters.transmission.toLowerCase()
      );
    }

    if (filters.location !== 'all') {
      filteredproducts = filteredproducts.filter(x =>
        x.location.toLowerCase() === filters.location.toLowerCase()
      );
    }

    return filteredproducts;
  }

  // Upload product files to Firebase storage, including car document and images
  uploadproductFiles() {
    if (!this.productDetails.carDocument.match(this.firebaseStorageUrl)) {
      this.utils.uploadImageOnFirebase(this.productDetails.carDocument, 'carDocument')
        .then((url: string) => {
          this.productDetails.carDocument = url;
          this.uploadproductFiles();
        });
    } else if (!this.productDetails.coverImageUrl.match(this.firebaseStorageUrl)) {
      this.utils.uploadImageOnFirebase(this.productDetails.coverImageUrl, 'productImages')
        .then((url: string) => {
          this.productDetails.coverImageUrl = url;
          this.uploadproductFiles();
        });
    } else if (this.productDetails.imageUrls?.length && this.isAnyNewproductImagePicked()) {
      const productImages: string[] = this.deepCloneData(this.productDetails.imageUrls) || [];
      this.productDetails.imageUrls = [];
      let newImages = [];
      productImages.forEach(x => {
        if (x.match(this.firebaseStorageUrl)) {
          this.productDetails.imageUrls.push(x);
        } else {
          newImages.push(x);
        }
      });
      newImages.length ? this.uploadproductImages(newImages) : this.uploadproductFiles();
    } else {
      this.saveproductDetailOnFirebase();
    }
  }

  // Upload new product images to Firebase storage
  uploadproductImages(newImages: string[]) {
    this.utils.uploadImageOnFirebase(newImages[0], 'productImages')
      .then((url: string) => {
        this.productDetails.imageUrls.push(url);
        newImages.splice(0, 1);
        newImages.length ? this.uploadproductImages(newImages) : this.uploadproductFiles();
      });
  }

  // Save product details to Firebase database
  saveproductDetailOnFirebase() {
    const myUid = localStorage.getItem('uid');
    if (!this.productDetails.productId) {
      this.productDetails.productId = firebase.database().ref().child('products').push().key;
      this.productDetails.hostUid = myUid;
      this.productDetails.createdOn = Number(new Date());
    }

    const urlPath = `products/${this.productDetails.productId}`;
    this.updateDataOnFirebase(urlPath, this.productDetails).then(() => {
      const index = this.allproducts.findIndex(x => x.productId === this.productDetails.productId);
      index >= 0 ? this.allproducts[index] = this.productDetails : this.allproducts.push(this.productDetails);
      this.productDetails = new iProduct();
      this.utils.stopLoading();
      this.showInfoSavedPopup = true;
      this.publishSomeData({ productsFetched: true });
    });
  }

  // Check if any new product images were picked
  isAnyNewproductImagePicked(): boolean {
    const index = this.productDetails.imageUrls.findIndex(x => !x.match(this.firebaseStorageUrl));
    return index >= 0;
  }

  // Check if the car document has changed
  isAnyDocumentChanged(): boolean {
    return !this.productDetails.carDocument.match(this.firebaseStorageUrl);
  }

  // Check if a new cover image was picked
  isNewCoverImagePicked(): boolean {
    return !this.productDetails.coverImageUrl.match(this.firebaseStorageUrl);
  }

  // Deep clone an object
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