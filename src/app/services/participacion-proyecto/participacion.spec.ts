import { TestBed } from '@angular/core/testing';

import { Participacion } from './participacion';

describe('Participacion', () => {
  let service: Participacion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Participacion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
