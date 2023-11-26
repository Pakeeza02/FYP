import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { iUser } from 'src/app/models/user';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpHelperService } from 'src/app/services/http-helper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  onLoginForm: any = FormGroup;
  user: iUser = new iUser();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dataHelper: DataHelperService,
    public httpHelper: HttpHelperService,
    public userAuth: UserAuthService,
    private toastr: ToastrService
  ) {
    if (localStorage.getItem('userLoggedIn') === 'true') {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.onLoginForm = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),
      ])],
      password: ['', Validators.compose([
        Validators.required,
      ])]
    });
  }

  loginAccount(formData: any) {
    debugger
    try {
      console.log('Login button clicked.');
      this.dataHelper.displayLoading = true;
      debugger
      this.userAuth.loginUser(formData)
        .then((data) => {
          debugger
          if (data) {
            this.getUserData(data.user.uid);
          }
        });
    } catch (error) {
      console.error('Error in loginAccount:', error);
    }
  }

  getUserData(uid: string) {
    console.log('Getting user data.'); // Add this line for debugging
    const urlPath = `users/${uid}`;
    this.httpHelper.getFirebaseData(urlPath)
      .then((snapshot) => {
        const user = snapshot.val();
        if (user) {
          if (!user.isBlocked) {
            this.userAuth.setUser(user);
            this.toastr.success("Logged in successfully!");
            console.log('Navigating to home page.'); // Add this line for debugging
            this.router.navigate(['home']);
          } else {
            this.toastr.error("User not authenticated!");
          }
        } else {
          this.userAuth.logoutUser();
        }
      });
  }


}