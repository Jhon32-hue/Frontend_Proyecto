import { TestBed } from '@angular/core/testing';

import { Sincronizacion } from './sincronizacion';

describe('Sincronizacion', () => {
  let service: Sincronizacion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sincronizacion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
