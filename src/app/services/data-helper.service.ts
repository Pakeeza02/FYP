import { Injectable } from '@angular/core';
import { iChatNode } from '../models/chat';
import { iUser } from '../models/user';
import { UtilsProviderService } from './utils-provider.service';
import { Subject } from 'rxjs';
import firebase from 'firebase';
import { iVehicle, iVehicleStatus } from '../models/vehicle';
import { iFilter } from '../models/filter';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DataHelperService {

  vehicleDetails: iVehicle = new iVehicle();
  myChats: iChatNode[] = [];
  selectedChat: iChatNode;
  allVehicles: iVehicle[] = [];
  showInfoSavedPopup: boolean;
  registrationYear: number[] = [];
  carCompany: string[] = ['Toyota', 'Honda', 'Suzuki', 'KIA', 'Hyundai', 'Nissan', 'Mitsubishi', 'Mercedes-Benz', 'Audi', 'BMW',];
  carModels: string[] = ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Sportage', 'Hyundai Tucson', 'Nissan Sunny', 'Mitsubishi Mirage', 'Mercedes-Benz C-Class', 'Audi A3', 'BMW 3 Series'];
  userType: string;
  allCars: iVehicle[] = [];
  firebaseStorageUrl = 'https://firebasestorage';
  appliedFilters: iFilter;
  userAvatar = 'assets/images/profile.jpg'
  fooSubject = new Subject<any>();
  allUsers: any = {};
  currentUser: iUser = new iUser();
  vehiclesFetched: boolean;

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

  // Fetch all user and vehicle data when the service is constructed
  fetchAllData() {
    this.getAllUsers();
    this.getAllVehicles();
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

  // Retrieve all vehicle data from Firebase
  getAllVehicles() {
    this.vehiclesFetched = false;
    this.getFirebaseData('vehicles')
      .then((snapshot) => {
        this.allVehicles = [];
        const vehicles = snapshot.val() || {};
        for (const key in vehicles) {
          const vehicle: iVehicle = vehicles[key];
          this.allVehicles.push(vehicle);
        }
        this.utils.stopLoading();
        this.getMyChats();
        this.vehiclesFetched = true;
        this.publishSomeData({ vehiclesFetched: true });
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

  // Apply filters to the list of vehicles and return the filtered list
  filterVehicles() {
    const filters = this.appliedFilters;
    if (!filters) {
      return this.allVehicles;
    }

    let filteredVehicles: iVehicle[] = this.allVehicles;

    if (filters?.minPrice) {
      filteredVehicles = filteredVehicles.filter(x =>
        Number(x?.carPrice) >= Number(filters?.minPrice) && Number(x?.carPrice) <= Number(filters?.maxPrice)
      );
    }

    if (filters?.minMileage) {
      filteredVehicles = filteredVehicles.filter(x =>
        Number(x?.mileage) >= Number(filters?.minMileage) && Number(x?.mileage) <= Number(filters?.maxMileage)
      );
    }

    if (filters?.minYear) {
      filteredVehicles = filteredVehicles.filter(x =>
        Number(x?.vehicleRegYear) >= Number(filters?.minYear) && Number(x?.vehicleRegYear) <= Number(filters?.maxYear)
      );
    }

    if (filters.company !== 'all') {
      filteredVehicles = filteredVehicles.filter(x =>
        x.vehicleCompany.toLowerCase() === filters.company.toLowerCase()
      );
    }

    if (filters.model !== 'all') {
      filteredVehicles = filteredVehicles.filter(x =>
        x.vehicleModel?.toLowerCase() === filters.model.toLowerCase()
      );
    }

    if (filters.carburant !== 'all') {
      filteredVehicles = filteredVehicles.filter(x =>
        x.carburant.toLowerCase() === filters.carburant.toLowerCase()
      );
    }

    if (filters.transmission !== 'all') {
      filteredVehicles = filteredVehicles.filter(x =>
        x.transmission.toLowerCase() === filters.transmission.toLowerCase()
      );
    }

    if (filters.location !== 'all') {
      filteredVehicles = filteredVehicles.filter(x =>
        x.location.toLowerCase() === filters.location.toLowerCase()
      );
    }

    return filteredVehicles;
  }

  // Upload vehicle files to Firebase storage, including car document and images
  uploadVehicleFiles() {
    if (!this.vehicleDetails.carDocument.match(this.firebaseStorageUrl)) {
      this.utils.uploadImageOnFirebase(this.vehicleDetails.carDocument, 'carDocument')
        .then((url: string) => {
          this.vehicleDetails.carDocument = url;
          this.uploadVehicleFiles();
        });
    } else if (!this.vehicleDetails.coverImageUrl.match(this.firebaseStorageUrl)) {
      this.utils.uploadImageOnFirebase(this.vehicleDetails.coverImageUrl, 'vehicleImages')
        .then((url: string) => {
          this.vehicleDetails.coverImageUrl = url;
          this.uploadVehicleFiles();
        });
    } else if (this.vehicleDetails.imageUrls?.length && this.isAnyNewVehicleImagePicked()) {
      const vehicleImages: string[] = this.deepCloneData(this.vehicleDetails.imageUrls) || [];
      this.vehicleDetails.imageUrls = [];
      let newImages = [];
      vehicleImages.forEach(x => {
        if (x.match(this.firebaseStorageUrl)) {
          this.vehicleDetails.imageUrls.push(x);
        } else {
          newImages.push(x);
        }
      });
      newImages.length ? this.uploadVehicleImages(newImages) : this.uploadVehicleFiles();
    } else {
      this.saveVehicleDetailOnFirebase();
    }
  }

  // Upload new vehicle images to Firebase storage
  uploadVehicleImages(newImages: string[]) {
    this.utils.uploadImageOnFirebase(newImages[0], 'vehicleImages')
      .then((url: string) => {
        this.vehicleDetails.imageUrls.push(url);
        newImages.splice(0, 1);
        newImages.length ? this.uploadVehicleImages(newImages) : this.uploadVehicleFiles();
      });
  }

  // Save vehicle details to Firebase database
  saveVehicleDetailOnFirebase() {
    const myUid = localStorage.getItem('uid');
    if (!this.vehicleDetails.vehicleId) {
      this.vehicleDetails.vehicleId = firebase.database().ref().child('vehicles').push().key;
      this.vehicleDetails.hostUid = myUid;
      this.vehicleDetails.createdOn = Number(new Date());
    }

    const urlPath = `vehicles/${this.vehicleDetails.vehicleId}`;
    this.updateDataOnFirebase(urlPath, this.vehicleDetails).then(() => {
      const index = this.allVehicles.findIndex(x => x.vehicleId === this.vehicleDetails.vehicleId);
      index >= 0 ? this.allVehicles[index] = this.vehicleDetails : this.allVehicles.push(this.vehicleDetails);
      this.vehicleDetails = new iVehicle();
      this.utils.stopLoading();
      this.showInfoSavedPopup = true;
      this.publishSomeData({ vehiclesFetched: true });
    });
  }

  // Check if any new vehicle images were picked
  isAnyNewVehicleImagePicked(): boolean {
    const index = this.vehicleDetails.imageUrls.findIndex(x => !x.match(this.firebaseStorageUrl));
    return index >= 0;
  }

  // Check if the car document has changed
  isAnyDocumentChanged(): boolean {
    return !this.vehicleDetails.carDocument.match(this.firebaseStorageUrl);
  }

  // Check if a new cover image was picked
  isNewCoverImagePicked(): boolean {
    return !this.vehicleDetails.coverImageUrl.match(this.firebaseStorageUrl);
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