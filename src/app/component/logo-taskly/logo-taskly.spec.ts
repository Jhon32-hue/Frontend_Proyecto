import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoTaskly } from './logo-taskly';

describe('LogoTaskly', () => {
  let component: LogoTaskly;
  let fixture: ComponentFixture<LogoTaskly>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoTaskly]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoTaskly);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
