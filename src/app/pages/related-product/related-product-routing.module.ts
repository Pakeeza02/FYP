import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RelatedProductPage } from './related-product.page';

const routes: Routes = [
  {
    path: '',
    component: RelatedProductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelatedProductPageRoutingModule {}
