import { TestBed } from '@angular/core/testing';

import { LikedmealsService } from './likedmeals.service';

describe('LikedmealsService', () => {
  let service: LikedmealsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LikedmealsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
