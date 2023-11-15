import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserRolePage } from './user-role.page';

describe('UserRolePage', () => {
  let component: UserRolePage;
  let fixture: ComponentFixture<UserRolePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UserRolePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
