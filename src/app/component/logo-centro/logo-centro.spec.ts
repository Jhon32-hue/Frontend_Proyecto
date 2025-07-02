import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoCentro } from './logo-centro';

describe('LogoCentro', () => {
  let component: LogoCentro;
  let fixture: ComponentFixture<LogoCentro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoCentro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoCentro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
