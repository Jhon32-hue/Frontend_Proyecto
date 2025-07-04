import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { strictProjectGuardGuard } from './strict-project-guard-guard';

describe('strictProjectGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => strictProjectGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
