import { TestBed } from '@angular/core/testing';

import { InvitarColaborador } from './invitar-colaborador';

describe('InvitarColaborador', () => {
  let service: InvitarColaborador;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvitarColaborador);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
