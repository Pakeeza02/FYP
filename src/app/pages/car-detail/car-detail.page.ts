import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { iChatNode } from 'src/app/models/chat';
import { iUser } from 'src/app/models/user';
import { iVehicle } from 'src/app/models/vehicle';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UtilsProviderService } from 'src/app/services/utils-provider.service';

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.page.html',
  styleUrls: ['./car-detail.page.scss'],
})
export class CarDetailPage implements OnInit {

  user: iUser = new iUser();
  currentUser: iUser = new iUser();
  isMyVehicle: boolean;
  vehicleHost: iUser = new iUser();
  vehicleDetails: iVehicle = new iVehicle();

  constructor(
    public alertController: AlertController,
    public navCtrl: NavController,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService,
    public utils: UtilsProviderService
  ) { }

  ngOnInit() {
    // Initialize the component with vehicle details and user information
    this.vehicleDetails = this.dataHelper.vehicleDetails;
    this.vehicleHost = this.dataHelper.allUsers[this.vehicleDetails.hostUid];
    this.isMyVehicle = this.dataHelper.vehicleDetails.hostUid === this.userAuth.currentUser.uid;
    this.currentUser = this.userAuth.currentUser;
  }

  // Prompt the user to confirm car deletion
  async deleteCar() {
    // Display an alert to confirm car deletion
    const alert = await this.alertController.create({
      header: 'Delete Car',
      message: 'Are you sure you want to delete this car?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'danger',
          handler: () => { },
        },
        {
          text: 'Delete',
          cssClass: 'danger',
          role: 'confirm',
          handler: () => {
            this.removeVehicleFromFirebase();
          },
        },
      ],
    });
    await alert.present();
  }

  // Remove the vehicle details from Firebase
  removeVehicleFromFirebase() {
    const urlPath = `vehicles/${this.vehicleDetails.vehicleId}`;
    this.dataHelper.updateDataOnFirebase(urlPath, null)
      .then(() => {
        this.utils.createToast('Car deleted successfully');
        this.dataHelper.getAllVehicles();
        this.navCtrl.navigateRoot(['/tabs/tab1']);
      });
  }

  // Open a chat with the vehicle owner
  openChat() {
    const chatKey = this.userAuth.currentUser.uid.concat(this.vehicleDetails.vehicleId);
    let chatNode: iChatNode = this.dataHelper.myChats.find(x => x.chatKey === chatKey);
    // Check if a chat already exists, if not, create a new chat node
    if (!chatNode) {
      chatNode = new iChatNode();
      chatNode.chatKey = chatKey;
      chatNode.clientUid = this.userAuth.currentUser.uid;
      chatNode.hostUid = this.vehicleDetails.hostUid;
      chatNode.vehicleId = this.vehicleDetails.vehicleId;
    }
    this.dataHelper.selectedChat = chatNode;
    // and navigate to the chat screen
    this.navCtrl.navigateForward(['/inbox']);
  }

}