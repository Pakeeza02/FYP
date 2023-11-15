import { Component } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(public dataHelper:DataHelperService) {}

}
