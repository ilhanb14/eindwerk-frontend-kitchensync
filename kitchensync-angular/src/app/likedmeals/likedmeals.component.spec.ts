import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikedMealsComponent } from './likedmeals.component';

describe('LikedmealsComponent', () => {
  let component: LikedMealsComponent;
  let fixture: ComponentFixture<LikedMealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LikedMealsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LikedMealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
