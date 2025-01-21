import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LikedMealsService {
  private url = "http://127.0.0.1:8000/api/";

  constructor() { }

  async getByUser(userId: number) {
    try {
      const response = await fetch(this.url + "likedmeals/" + userId);
      return await response.json();
    } catch (error) {
      console.error("Error fetching liked meals:", error);
    }
  }

  async likeMeal(mealId: number, userId: number) {

    try {
      const likedMeals = await this.getByUser(userId);
      if (likedMeals.some((row: any) => row.meal_id)) {
        await fetch(this.url + "likedmeals", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            meal_id: mealId,
            user_id: userId
          })
        });
      }
    } catch (error) {
      console.error("Error liking meal:", error);
    }
  }

  async deleteLikedMeal(id: number) {
    try {
      fetch(this.url + "likedmeals/" + id, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error("Error deleting liked meal:", error);
    }
  }

  async deleteLikedMealByData(mealId: number, userId: number) {
    try {
      const likedMeals: any[] = await this.getByUser(userId);
      let likedMeal = likedMeals.find(row => row.meal_id === mealId && row.user_id === userId);
      if (likedMeal) {
        this.deleteLikedMeal(likedMeal.id);
      }
    } catch (error) {
      console.error("Error deleting meal by mealId and userId:", error);
    }
  }
}
