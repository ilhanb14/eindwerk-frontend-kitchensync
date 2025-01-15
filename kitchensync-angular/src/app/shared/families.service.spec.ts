import { TestBed } from '@angular/core/testing';

import { FamiliesService } from './families.service';

describe('FamiliesService', () => {
  let service: FamiliesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamiliesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
