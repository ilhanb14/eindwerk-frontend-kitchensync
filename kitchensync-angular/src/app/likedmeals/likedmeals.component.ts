import { Component } from '@angular/core';
import { LikedMealsService } from '../shared/likedmeals.service';
import { SpoonacularService } from '../shared/spoonacular.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-likedmeals',
  imports: [RouterLink],
  templateUrl: './likedmeals.component.html',
  styleUrl: './likedmeals.component.css'
})
export class LikedMealsComponent {
  likedMeals: any[] = [];
  private userId: number = Number(sessionStorage.getItem('id'));

  constructor(private likedMealsService: LikedMealsService, private spoonacularService: SpoonacularService) {
    this.fetchLikedMeals();
  }

  async fetchLikedMeals() {
    this.likedMeals = []; // clear liked meals to avoid duplicates
    const likedMealIds = await this.likedMealsService.getByUser(this.userId).then(result => result.map((row: { meal_id: number; }) => row.meal_id));  // get ids of liked meals
    this.likedMeals = await this.spoonacularService.getMealsById(likedMealIds);
  }

  unlikeClicked(mealId: number) {
    const mealName = this.likedMeals.find(meal => meal.id === mealId)!.title;
    let confirmed = confirm("Are you sure you want to unlike \"" + mealName + "\"?")
    
    if(confirmed) {
      this.likedMealsService.deleteLikedMealByData(mealId, this.userId);
      this.likedMeals = this.likedMeals.filter(meal => meal.id != mealId);  // Update local array of likedmeals to avoid another fetch
    }
  }
}
