import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UtilsProviderService } from 'src/app/services/utils-provider.service';
import firebase from 'firebase';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  showPassword: boolean;
  showConfPassword: boolean;

  onRegisterForm: FormGroup;
  loginProcessing: boolean;

  constructor(
    public alertController: AlertController,
    public formBuilder: FormBuilder,
    public router: Router,
    public utils: UtilsProviderService,
    public navCtrl: NavController,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService,
  ) { }

  ngOnInit() {
    // Initialize the registration form with fields for full name, email, password, and password confirmation, along with validation rules
    this.onRegisterForm = this.formBuilder.group({
      fullName: ['', Validators.compose([
        Validators.required
      ])],
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),
      ])],
      password: ['', Validators.compose([
        Validators.required,
      ])],
      cPassword: ['', Validators.compose([
        Validators.required
      ])],
    });
  }

  // Create a new user account using the provided data
  createAccount(data) {
    const self = this;
    if (data.password !== data.cPassword) {
      // Display a toast message if the passwords do not match
      self.utils.createToast('New passwords do not match!');
    } else {
      self.loginProcessing = true;
      // Sign up the user with the provided email and password
      self.userAuth.signupUser(data.email, data.password)
        .then((user) => {
          if (user) {
            // If the user is successfully signed up, add user data to the user table
            data.uid = firebase.auth().currentUser.uid;
            self.saveDatatoUserTableAfterRegister(data);
          }
        })
        .catch((error) => {
          // An error occurred during user registration
          self.loginProcessing = false;
          self.utils.createToast(error.message);
        });
    }
  }

  // Save user data to the Firebase user table after registration
  saveDatatoUserTableAfterRegister(data) {
    const self = this;
    data.password = null;
    data.cPassword = null;
    data.createdOn = Number(new Date());
    const updates = {};
    updates['/users/' + data.uid] = data;
    firebase.database().ref().update(updates).then(() => {
      self.loginProcessing = false;
      self.userAuth.setUser(data);
      self.dataHelper.publishSomeData({ newLoggedIn: true });
      self.navCtrl.navigateRoot(['/user-role']);
    });
  }

}
