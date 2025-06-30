import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarPanel } from './calendar-panel';

describe('CalendarPanel', () => {
  let component: CalendarPanel;
  let fixture: ComponentFixture<CalendarPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
