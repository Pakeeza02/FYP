import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, NavController } from '@ionic/angular';
import { iUser } from 'src/app/models/user';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UtilsProviderService } from 'src/app/services/utils-provider.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  maxYear: number;
  currentUser: iUser;
  imagePath: any;
  newFile: boolean;

  constructor(
    public router: Router,
    public navCtrl: NavController,
    public dataHelper: DataHelperService,
    public utils: UtilsProviderService,
    public userAuth: UserAuthService,
    public actionSheetController: ActionSheetController,
  ) { }

  ngOnInit() {
    // Initialize user data and set the maximum allowed birth year
    this.currentUser = this.userAuth.currentUser;
    this.imagePath = this.currentUser.profileUrl;
    const currentYear = (new Date()).getFullYear();
    this.maxYear = currentYear - 10;
  }

  // Handle user's click on the profile picture and update the image
  pictureClick() {
    this.utils.openCameraOptions().then((res) => {
      if (res) {
        this.imagePath = res;
        this.newFile = true;
      }
    });
  }

  // Update the user profile information & check if required fields are filled, and save changes
  updateProfile() {
    if (!this.currentUser.fullName) {
      this.utils.createToast('Empty field is required!');
      return;
    }
    this.newFile ? this.saveImage() : this.updateData();
  }

  // Save the user's profile image to Firebase Storage and update the data
  saveImage() {
    const self = this;
    self.utils.uploadImageOnFirebase(self.imagePath, 'profileImages')
      .then((url: string) => {
        self.currentUser.profileUrl = url;
        self.updateData();
      });
  }

  // Update user's profile data in Firebase Database
  updateData() {
    const self = this;
    const path = `users/${self.currentUser.uid}`;
    self.dataHelper.updateDataOnFirebase(path, self.currentUser)
      .then(() => {
        self.utils.stopLoading();
        self.userAuth.setUser(self.currentUser);
        self.utils.createToast('Profile updated successfully!');
        self.navCtrl.back();
      });
  }

}