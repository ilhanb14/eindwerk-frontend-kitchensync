import { Component } from '@angular/core';
import { LikedMealsService } from '../shared/likedmeals.service';
import { SpoonacularService } from '../shared/spoonacular.service';

@Component({
  selector: 'app-likedmeals',
  imports: [],
  templateUrl: './likedmeals.component.html',
  styleUrl: './likedmeals.component.css'
})
export class LikedMealsComponent {
  likedMeals: any[] = [];
  private userId: number = 1; // TODO: get userId from local storage

  constructor(private likedMealsService: LikedMealsService, private spoonacularService: SpoonacularService) {
    this.fetchLikedMeals();
  }

  async fetchLikedMeals() {
    this.likedMeals = []; // clear liked meals to avoid duplicates
    const likedMealIds = await this.likedMealsService.getByUser(this.userId).then(result => result.map((row: { meal_id: number; }) => row.meal_id));  // get ids of liked meals

    for (let mealId of likedMealIds) {  // for each liked meal get its data from spoonacular
      // TODO use spoonacular
      //this.likedMeals.push(await this.spoonacularService.getMealById(mealId, false));
      // TEMPORARILY NOT USING SPOONACULAR TO AVOID USING POINTS
      this.likedMeals.push({id: mealId, title: mealId, image:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/1280px-Placeholder_view_vector.svg.png"})
    }
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
