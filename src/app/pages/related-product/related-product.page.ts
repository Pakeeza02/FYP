import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { iProduct } from 'src/app/models/product';
import { DataHelperService } from 'src/app/services/data-helper.service';

@Component({
  selector: 'app-related-product',
  templateUrl: './related-product.page.html',
  styleUrls: ['./related-product.page.scss'],
})
export class RelatedProductPage implements OnInit {

  categoryRelatedProducts: iProduct[] = []

  constructor(public dataHelper: DataHelperService, public navCtrl: NavController) {
    this.categoryRelatedProducts = this.dataHelper.allProducts.filter(x => x.productCategory === this.dataHelper.selectedCategory.categoryTitle)
  }

  ngOnInit() {
  }

  productDetail(product: any) {
    this.dataHelper.productDetails = this.dataHelper.deepCloneData(product);
    this.navCtrl.navigateForward(['/product-details']);
  }
}
