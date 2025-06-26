import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleAssignment } from './role-assignment';

describe('RoleAssignment', () => {
  let component: RoleAssignment;
  let fixture: ComponentFixture<RoleAssignment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleAssignment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleAssignment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
