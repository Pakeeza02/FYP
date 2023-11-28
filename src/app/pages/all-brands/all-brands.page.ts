import { Component, OnInit } from '@angular/core';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { HttpHelperService } from 'src/app/services/http-helper.service';
import { ToastrService } from 'ngx-toastr';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-all-brands',
  templateUrl: './all-brands.page.html',
  styleUrls: ['./all-brands.page.scss'],
})
export class AllBrandsPage implements OnInit {

  constructor(
    public httpHelper: HttpHelperService,
    public dataHelper: DataHelperService,
    public toastr: ToastrService,
    public userAuth: UserAuthService,
  ) { }

  ngOnInit() {
  }



}
