import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { SwUpdate } from '@angular/service-worker';
import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public swUpdate: SwUpdate
  ) {
    this.initializeApp();
  }

  // Initialize the app when the platform is ready
  initializeApp() {
    this.platform.ready().then(() => {
      if (localStorage.getItem('userLoggedIn')) {
        // If a user is logged in, navigate to the user-role page
        this.navCtrl.navigateRoot(['/user-role']);
      }
    });
  }
}
