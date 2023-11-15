import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
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

  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showConfrimPassword: boolean;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;

  constructor(
    public utils: UtilsProviderService,
    public userAuth: UserAuthService,
    public navCtrl: NavController,
    public dataHelper: DataHelperService,
  ) {
  }

  ngOnInit() {
  }


  // Update the user's password
  updatePassword() {
    // Check if the new passwords match, then attempt to update the password
    if (this.newPassword !== this.confirmNewPassword) {
      this.utils.createToast('New passwords do not match!');
      return;
    }
    const self = this;
    const user: iUser = this.userAuth.currentUser;
    self.utils.presentLoading();
    self.userAuth.loginUser(user.email, self.currentPassword)
      .then((firebaseUser) => {
        if (firebaseUser) {
          self.userAuth.updatePassword(self.newPassword).then(() => {
            self.utils.stopLoading();
            self.utils.createToast('Password updated successfully!');
            self.userAuth.logoutUser();
          })
            .catch((e) => {
              self.utils.stopLoading();
              self.utils.createToast(e.message);
            });
        } else {
          self.utils.stopLoading();
          self.navCtrl.back();
        }
      })
      .catch((e) => {
        self.utils.stopLoading();
        self.utils.createToast('Your current password is incorrect!');
      });
  }

}