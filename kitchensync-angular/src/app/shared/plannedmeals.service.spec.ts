import { TestBed } from '@angular/core/testing';

import { PlannedMealsService } from './plannedmeals.service';

describe('PlannedMealsService', () => {
  let service: PlannedMealsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlannedMealsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
