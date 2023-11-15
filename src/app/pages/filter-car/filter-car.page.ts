import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { iFilter } from 'src/app/models/filter';
import { DataHelperService } from 'src/app/services/data-helper.service';

@Component({
  selector: 'app-filter-car',
  templateUrl: './filter-car.page.html',
  styleUrls: ['./filter-car.page.scss'],
})
export class FilterCarPage implements OnInit {

  maxYear: number = new Date().getFullYear();
  filters: iFilter = new iFilter();
  priceRange = { lower: 0, upper: 5000 };
  yearRange = { lower: 1990, upper: 2023 };
  mileageRange = { lower: 0, upper: 100000 };
  currentYear = new Date().getFullYear();

  constructor(
    private modalCtrl: ModalController,
    public navParams: NavParams,
    public dataHelper: DataHelperService
  ) { }

  ngOnInit() {
    // Initialize the filter settings based on provided data or defaults
    this.filters = this.navParams.data['filters'] || new iFilter();
    this.priceRange.lower = this.filters.minPrice;
    this.priceRange.upper = this.filters.maxPrice;
    this.yearRange.lower = this.filters.minYear;
    this.yearRange.upper = this.filters.maxYear;
    this.mileageRange.lower = this.filters.minMileage;
    this.mileageRange.upper = this.filters.maxMileage;
  }

  // Update the price range filter based on user input
  updatePriceFilter(e: any) {
    this.filters.minPrice = e.detail.value.lower;
    this.filters.maxPrice = e.detail.value.upper;
  }

  // Update the year range filter based on user input
  updateYearRange(e: any) {
    this.filters.minYear = e.detail.value.lower;
    this.filters.maxYear = e.detail.value.upper;
  }

  // Update the mileage filter based on user input
  updateMileage(e: any) {
    this.filters.minMileage = e.detail.value.lower;
    this.filters.maxMileage = e.detail.value.upper;
  }

  // Custom formatting for price value display
  pinFormatter(value: number) {
    return `$${value}`;
  }

  // Custom formatting for year value display
  pinFormat(value: number) {
    return `${value}`;
  }

  // Custom formatting for milage value display
  pinFormater(value: number) {
    return `${value} Km`;
  }

  // Dismiss the filter modal without applying changes
  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  // Apply the selected filters and close the modal
  applyFilters() {
    this.modalCtrl.dismiss({
      'dismissed': true,
      'filters': this.filters
    });
  }

  // Reset filters to their initial state
  resetFilters() {
    this.modalCtrl.dismiss({
      'dismissed': true,
      'resetFilters': true
    });
  }

}