import { Injectable, NgZone } from '@angular/core';
import { iUser } from '../models/user';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DataHelperService } from './data-helper.service';
import { Subject } from 'rxjs';
import firebase from 'firebase';
import { UtilsProviderService } from './utils-provider.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  currentUser: iUser = new iUser();
  fooSubject = new Subject<any>();
  isLogin: any;

  currentUserLocation = {
    userLat: null,
    userLng: null,
  };

  constructor(
    public zone: NgZone,
    public router: Router,
    public navCtrl: NavController,
    public dataHelper: DataHelperService,
    public utils: UtilsProviderService,
    public toastr: ToastrService
  ) {
    if (localStorage.getItem('userLoggedIn')) {
      this.getCurrentUser();
    }
    // Subscribe to updates from the DataHelperService
    this.dataHelper.getObservable().subscribe((res) => {
      if (res.updateLocalUser) {
        this.getCurrentUser();
      }
    });
  }

  // Get the current user from local storage
  getCurrentUser() {
    this.currentUser = JSON.parse(localStorage.getItem('user'));
  }

  // Set the current user in local storage and fetch data from the server
  setUser(user: iUser) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('uid', user.uid);
    this.getCurrentUser();
    this.dataHelper.fetchAllData();
  }

  // Log out the user and clear local storage
  logoutUser() {
    firebase.auth().signOut().then(() => {
      this.navCtrl.navigateRoot(['/login']);
      localStorage.clear();
      this.currentUser = new iUser();
    });
  }

  // Publish data to the Subject for observers to react
  publishSomeData(data: any) {
    this.fooSubject.next(data);
  }

  // Check if a user is currently logged in
  isLoggedIn(): boolean {
    this.isLogin = localStorage.getItem('userLoggedIn') === 'true';
    return this.isLogin;
  }

  // Get an observable for the Subject
  getObservable(): Subject<any> {
    return this.fooSubject;
  }

  // Log in a user with email and password
  async loginUser(formData: any): Promise<any> {
    try {
      const user = await firebase.auth().signInWithEmailAndPassword(formData.email, formData.password);
      return user;
    } catch (e: any) {
      this.dataHelper.displayLoading = false;
      this.toastr.error(e.message);
    }
  }

  // Update the user's password
  updatePassword(password: string): Promise<any> {
    return firebase.auth().currentUser.updatePassword(password);
  }

  // Sign up a new user with email and password
  signupUser(email: string, password: string): Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

}
