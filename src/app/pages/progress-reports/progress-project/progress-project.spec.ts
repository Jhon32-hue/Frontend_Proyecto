import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressProject } from './progress-project';

describe('ProgressProject', () => {
  let component: ProgressProject;
  let fixture: ComponentFixture<ProgressProject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressProject]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressProject);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
