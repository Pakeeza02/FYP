import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UtilsProviderService } from 'src/app/services/utils-provider.service';
import firebase from 'firebase';
import { iUser } from 'src/app/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  showPassword: boolean;
  onLoginForm: FormGroup;
  loginProcessing: boolean;

  constructor(
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService,
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public utils: UtilsProviderService,
  ) { }

  ngOnInit() {
    // Initialize the login form with email and password fields and validation rules
    this.onLoginForm = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),
      ])],
      password: ['', Validators.compose([
        Validators.required,
      ])]
    });
  }

  // Attempt to log in with the provided email and password
  loginAccount(data) {
    const self = this;
    self.loginProcessing = true;
    self.userAuth.loginUser(data.email, data.password)
      .then((user) => {
        if (user) {
          self.getUserData(user.user.uid);
        }
      }).catch((e) => {
        self.loginProcessing = false;
        self.utils.createToast('Please input valid login credentials');
      });
  }

  // Retrieve user data from Firebase and set the current user
  getUserData(uid: string) {
    const self = this;
    firebase.database().ref().child('users/' + uid)
      .once('value', (snapshot) => {
        const user: iUser = snapshot.val();
        if (user) {
          self.loginProcessing = false;
          self.userAuth.setUser(user);
          self.dataHelper.publishSomeData({ newLoggedIn: true });
          self.navCtrl.navigateRoot(['/user-role']);
        } else {
          self.loginProcessing = false;
          self.utils.createToast('User does not exist!');
        }
      })
      .catch((e) => {
        self.loginProcessing = false;
        self.utils.createToast('Please input valid login credentials');
      });
  }

}