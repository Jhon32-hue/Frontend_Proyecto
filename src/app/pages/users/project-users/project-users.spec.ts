import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectUsers } from './project-users';

describe('ProjectUsers', () => {
  let component: ProjectUsers;
  let fixture: ComponentFixture<ProjectUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
