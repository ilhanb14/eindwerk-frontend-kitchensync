import { TestBed } from '@angular/core/testing';

import { MealtimesService } from './mealtimes.service';

describe('MealtimesService', () => {
  let service: MealtimesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MealtimesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
