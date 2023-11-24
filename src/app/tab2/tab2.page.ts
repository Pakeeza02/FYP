import { Component } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { iChatNode } from '../models/chat';
import { UserAuthService } from '../services/user-auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  // Array to store the list of chat nodes
  chatList: iChatNode[] = [];
  // Search query for filtering chat list
  searchQuery = '';
  // Variable to store the user's name
  userName: any;

  constructor(
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService,
    public navCtrl: NavController
  ) {
    // Subscribe to data changes to refresh the view when chats are fetched
    this.dataHelper.getObservable().subscribe(data => {
      if (data.myChatsFetched) {
        this.ionViewWillEnter();
      }
    });
  }

  // This method is called when the view will enter
  ionViewWillEnter() {
    this.chatList = this.dataHelper.myChats;
    this.chatList.sort((a, b) => b.lastMsgTime - a.lastMsgTime);
  }

  // Get the name of the chat's receiver based on the hostUid and currentUser's uid
  getReceiverName(chat: iChatNode): string {
    if (chat.hostUid === this.userAuth.currentUser.uid) {
      this.userName = this.dataHelper.allUsers[chat.clientUid]?.fullName ?? 'N/A';
      return this.userName;
    }

    return this.dataHelper.allUsers[chat.hostUid]?.fullName ?? 'N/A';
  }

  // Check if a chat should be visible based on the search query
  chatVisible(chat: iChatNode): boolean {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      return true;
    }
    const receiverName = this.getReceiverName(chat).toLowerCase();
    const productName = this.getproductTitle(chat).toLowerCase();
    return receiverName.indexOf(this.searchQuery.toLowerCase()) !== -1
      || productName.indexOf(this.searchQuery.toLowerCase()) !== -1;
  }

  // Get the image URL of a product based on its productId
  getproductImage(productId: string): string {
    return this.dataHelper.allproducts
      .find(x => x.productId === productId)?.coverImageUrl
      ?? this.dataHelper.userAvatar;
  }

  // Get the title of a product in a chat based on the productId
  getproductTitle(chat: iChatNode): string {
    return this.dataHelper.allproducts
      .find(x => x.productId === chat.productId)?.productName
      ?? 'product Not Available';
  }

  // Navigate to the chat screen when a chat is selected
  chatScreen(chat: iChatNode) {
    this.dataHelper.selectedChat = chat;
    this.navCtrl.navigateForward(['/inbox']);
  }
}