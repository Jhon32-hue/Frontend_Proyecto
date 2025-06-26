import { TestBed } from '@angular/core/testing';

import { Setting } from './setting';

describe('Setting', () => {
  let service: Setting;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Setting);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
