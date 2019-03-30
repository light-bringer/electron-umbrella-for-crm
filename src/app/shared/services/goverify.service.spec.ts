import { TestBed } from '@angular/core/testing';

import { GoverifyService } from './goverify.service';

describe('GoverifyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoverifyService = TestBed.get(GoverifyService);
    expect(service).toBeTruthy();
  });
});
