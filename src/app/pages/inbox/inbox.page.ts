import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import firebase from 'firebase';
import { iMessage } from 'src/app/models/chat';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UtilsProviderService } from 'src/app/services/utils-provider.service';
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements OnInit {


  @ViewChild(IonContent, { read: IonContent, static: false }) content: IonContent;
  writeMessage: string;
  messages: iMessage[] = [];
  myUid: string;
  chatId: string;
  recepientName: string;

  constructor(
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService,
    public utils: UtilsProviderService,
  ) { }

  ngOnInit() {
    this.chatId = this.dataHelper.selectedChat.chatKey;
    if (this.dataHelper.selectedChat.hostUid === this.userAuth.currentUser.uid) {
      this.recepientName = this.dataHelper.allUsers[this.dataHelper.selectedChat.clientUid]?.fullName ?? 'N/A';
    } else {
      this.recepientName = this.dataHelper.allUsers[this.dataHelper.selectedChat.hostUid]?.fullName ?? 'N/A';
    }
    this.myUid = this.userAuth.currentUser.uid;
    this.getChatMessages();
  }

  // Fetches chat messages from Firebase and displays them
  getChatMessages() {
    const chatRef = firebase.database().ref().child(`chats/${this.chatId}/messages`);
    chatRef.on('child_added', (snapshot) => {
      const chatMsg = snapshot.val();
      this.messages.push(chatMsg);
      this.messages.sort((a, b) => a.timestamp - b.timestamp);
      this.scrollToBottom();
    });
  }

  // Sends a message in the chat
  sendMessage(imageUrl?: string) {
    if (!this.writeMessage?.trim() && !imageUrl) {
      return;
    }
    const newMessage = new iMessage();
    newMessage.uid = this.myUid;
    newMessage.message = this.writeMessage;
    newMessage.image = imageUrl || null;
    newMessage.timestamp = Number(new Date());
    newMessage.key = firebase.database().ref().child(`chats/${this.chatId}/messages`).push().key;

    if (!this.messages.length) {
      this.saveHostAndClientIds();
    }

    this.updateLastMsg();
    const urlPath = `chats/${this.chatId}/messages/${newMessage.key}`;
    this.dataHelper.updateDataOnFirebase(urlPath, newMessage)
      .then(() => {
        this.writeMessage = null;
      });
  }

  // Updates the last message in the chat
  updateLastMsg() {
    const updates = {};
    updates[`/chats/${this.chatId}/lastMessage`] = this.writeMessage;
    updates[`/chats/${this.chatId}/lastMsgTime`] = Number(new Date());
    firebase.database().ref().update(updates);
  }

  // Saves host and client IDs for the chat
  saveHostAndClientIds() {
    const updates = {};
    updates[`/chats/${this.chatId}/chatKey`] = this.chatId;
    updates[`/chats/${this.chatId}/vehicleId`] = this.dataHelper.selectedChat.vehicleId;
    updates[`/chats/${this.chatId}/hostUid`] = this.dataHelper.selectedChat.hostUid;
    updates[`/chats/${this.chatId}/clientUid`] = this.dataHelper.selectedChat.clientUid;
    firebase.database().ref().update(updates);
  }

  // Scrolls to the bottom of the chat content
  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }

  // Updates the list of user's chats when leaving the view
  ionViewWillLeave() {
    this.dataHelper.getMyChats();
  }

}