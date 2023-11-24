import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllBrandsPage } from './all-brands.page';

describe('AllBrandsPage', () => {
  let component: AllBrandsPage;
  let fixture: ComponentFixture<AllBrandsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AllBrandsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
