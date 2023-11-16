import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilsProviderService } from 'src/app/services/utils-provider.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  constructor(public utils: UtilsProviderService, private navCtrl: NavController) { }

  ngOnInit() {
  }

  orderPlaced() {
    this.utils.createToast('Order has been placed successfully!');
    this.navCtrl.navigateRoot(['/home'])
  }

}
