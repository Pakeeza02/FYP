import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { iCategory } from 'src/app/models/category';
import { DataHelperService } from 'src/app/services/data-helper.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {

  constructor(public dataHelper: DataHelperService, public navCtrl: NavController) { }

  ngOnInit() { }

  navigateCategoryToServices(category: iCategory) {
    this.dataHelper.selectedCategory = category
    this.navCtrl.navigateForward(['/related-product']);
  }

}