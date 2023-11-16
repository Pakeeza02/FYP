import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  constructor(
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService,
    public route: Router
  ) { }

  ngOnInit() { }

  allProducts() {
    this.route.navigate(['/all-products'])
  }

  wishlist() {
    this.route.navigate(['/wishlist'])
  }

  cart() {
    this.route.navigate(['/cart'])
  }

}
