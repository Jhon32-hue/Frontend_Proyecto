import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayTasks } from './today-tasks';

describe('TodayTasks', () => {
  let component: TodayTasks;
  let fixture: ComponentFixture<TodayTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayTasks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayTasks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
