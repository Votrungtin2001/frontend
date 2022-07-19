import { TestBed } from '@angular/core/testing';

import { UnitMethodService } from './unit-method.service';

describe('UnitMethodService', () => {
  let service: UnitMethodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitMethodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
