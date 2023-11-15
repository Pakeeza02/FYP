import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataHelperService } from 'src/app/services/data-helper.service';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.page.html',
  styleUrls: ['./user-role.page.scss'],
})
export class UserRolePage implements OnInit {

  selectedUserType: string = '';

  constructor(
    private router: NavController,
    public dataHelper: DataHelperService
  ) { }

  ngOnInit() {
  }

  // Set the user type and navigate to the specified tab
  selectUserType(userType: string) {
    this.router.navigateRoot(['/home']);
    this.dataHelper.userType = userType;
  }

}