import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadCarPage } from './upload-car.page';

describe('UploadCarPage', () => {
  let component: UploadCarPage;
  let fixture: ComponentFixture<UploadCarPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UploadCarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
