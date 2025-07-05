import { TestBed } from '@angular/core/testing';

import { HistoriaUsuario } from './historia-usuario';

describe('HistoriaUsuario', () => {
  let service: HistoriaUsuario;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoriaUsuario);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
