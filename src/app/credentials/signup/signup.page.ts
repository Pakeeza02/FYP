import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { ToastrService } from 'ngx-toastr';
import firebase from 'firebase';
import { HttpHelperService } from 'src/app/services/http-helper.service';
import { iUser } from 'src/app/models/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  selectedUserType: string = '';
  onRegisterForm: any = FormGroup;
  user: iUser = new iUser();
  loginProcessing: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dataHelper: DataHelperService,
    public httpHelper: HttpHelperService,
    public userAuth: UserAuthService,
    private toastr: ToastrService
  ) {
    console.log('Component constructor called');
    if (localStorage.getItem('userLoggedIn') === 'true') {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.onRegisterForm = this.fb.group({
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

  createAccount(data: any) {
    const self = this;

    if (data.password !== data.cPassword) {
      self.toastr.error("Password mismatch!");
    } else {
      self.loginProcessing = true;
      self.userAuth.signupUser(data.email, data.password)
        .then((user) => {
          if (user) {
            const currentUser = firebase.auth().currentUser;
            if (currentUser) {
              data.uid = currentUser.uid;
              self.saveDatatoUserTableAfterRegister(data);
              this.toastr.success("Account authenticated successfully!")
            } else {
              self.toastr.error('User not authenticated.');
            }
          }
        })
        .catch((error) => {
          self.loginProcessing = false;
          self.toastr.error(error.message);
        });
    }
  }

  selectUserType(userType: string) {
    this.selectedUserType = userType;
  }

  saveDatatoUserTableAfterRegister(data: any) {
    const self = this;
    data.password = null;
    data.cPassword = null;
    data.isVerified = true;
    data.createdOn = Number(new Date());
    data.userType = this.selectedUserType;
    const urlPath = `users/${data.uid}`;
    self.dataHelper.updateDataOnFirebase(urlPath, data)
      .then(() => {
        self.loginProcessing = false;
        self.userAuth.setUser(data);
        this.router.navigate(['home']);
      });
  }
}