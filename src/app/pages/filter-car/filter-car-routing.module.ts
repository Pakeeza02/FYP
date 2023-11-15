import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FilterCarPage } from './filter-car.page';

const routes: Routes = [
  {
    path: '',
    component: FilterCarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilterCarPageRoutingModule {}
