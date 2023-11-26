import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { iUser } from 'src/app/models/user';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UtilsProviderService } from 'src/app/services/utils-provider.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  currentPassword = '';
  newPassword = '';
  confirmNewPassword = '';

  constructor(
    public router: Router,
    public utils: UtilsProviderService,
    public toastr: ToastrService,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('userLoggedIn') !== 'true') {
      this.router.navigate(['/login']);
    }
  }

  updatePassword() {
    if (this.newPassword !== this.confirmNewPassword) {
      this.toastr.error("Password mismatch!");
      return;
    }

    const self = this;
    self.dataHelper.displayLoading = true;
    const user: iUser = this.userAuth.currentUser;
    const data = {
      email: user.email,
      password: self.currentPassword
    };

    self.userAuth.loginUser(data)
      .then((firebaseUser) => {
        if (firebaseUser) {
          self.userAuth.updatePassword(self.newPassword)?.then(() => {
            self.dataHelper.displayLoading = false;
            self.toastr.success("Password updated successfully!");
            self.userAuth.logoutUser();
          })
            .catch((e: any) => {
              self.toastr.error(e.message);
            });
        }
      })
      .catch((e) => {
        self.toastr.error(e.message);
      });
  }

}
