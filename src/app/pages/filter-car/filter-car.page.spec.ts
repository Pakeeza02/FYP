import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterCarPage } from './filter-car.page';

describe('FilterCarPage', () => {
  let component: FilterCarPage;
  let fixture: ComponentFixture<FilterCarPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FilterCarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
