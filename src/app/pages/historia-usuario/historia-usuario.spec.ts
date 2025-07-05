import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriaUsuario } from './historia-usuario';

describe('HistoriaUsuario', () => {
  let component: HistoriaUsuario;
  let fixture: ComponentFixture<HistoriaUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriaUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriaUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
