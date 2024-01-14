import { Component, OnInit } from '@angular/core';
import { DataHelperService } from 'src/app/services/data-helper.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
})
export class WishlistPage implements OnInit {
  wishlistItems: any[] = []; // Placeholder for wishlist items

  constructor(public dataHelper: DataHelperService) {}

  ngOnInit() {
    this.loadWishlistItems();
  }

  // Load wishlist items from DataHelperService
  loadWishlistItems() { 
  }
}
