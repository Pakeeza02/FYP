import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { UtilsProviderService } from 'src/app/services/utils-provider.service';
import firebase from 'firebase';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  email: string;

  constructor(
    public dataHelper: DataHelperService,
    public utils: UtilsProviderService,
    public navCtrl: NavController) {
  }

  ngOnInit() {
  }

  // Attempt to reset the user's password
  resetPassword() {
    // Define a regular expression pattern for a valid email address
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // Check if the provided email matches the pattern
    const showError = !re.test(String(this.email).toLowerCase());
    if (showError) {
      // Check if the provided email matches the pattern
      this.utils.createToast('Invalid email pattern!');
      return;
    }

    const self = this;
    self.utils.presentLoading();
    // Send a password reset email to the provided email address
    firebase.auth().sendPasswordResetEmail(self.email)
      .then(() => {
        self.utils.stopLoading();
        self.utils.createToast('Click the link sent in the email and follow the instructions!');
        self.navCtrl.back();
      })
      .catch((e) => {
        // An error occurred while sending the password reset email
        self.utils.stopLoading();
        self.utils.createToast(e.message);
      });
  }

}