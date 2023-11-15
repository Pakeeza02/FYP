import { Component } from '@angular/core';
import { ActionSheetController, AlertController, NavController } from '@ionic/angular';
import { UserAuthService } from '../services/user-auth.service';
import { DataHelperService } from '../services/data-helper.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  showDeleteAccountConfirmation: boolean;

  constructor(
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    public navCtrl: NavController,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService
  ) { }

  // Display a confirmation alert for logging out the user
  async logoutAlert() {
    const alert = await this.alertController.create({
      header: 'Logout Account',
      message: 'Are you sure you want to logout your account?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'danger',
          handler: () => { /* Cancel button handler: Do nothing */ },
        },
        {
          text: 'Confirm',
          cssClass: 'danger',
          role: 'confirm',
          handler: () => {
            // Confirm button handler: Logout the user
            this.userAuth.logoutUser();
          },
        },
      ],
    });
    await alert.present();
  }

  ngOnInit() {
  }

}
