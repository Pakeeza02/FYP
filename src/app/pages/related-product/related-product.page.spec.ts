import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RelatedProductPage } from './related-product.page';

describe('RelatedProductPage', () => {
  let component: RelatedProductPage;
  let fixture: ComponentFixture<RelatedProductPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RelatedProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
