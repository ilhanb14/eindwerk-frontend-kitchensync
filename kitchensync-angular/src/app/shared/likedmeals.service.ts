import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LikedMealsService {
  private url = "http://127.0.0.1:8000/api/";

  constructor() { }

  /**
   * Get all meals liked by a specific user
   * @param userId
   * @returns Array of liked meals as {id, meal_id, user_id}
   */
  async getByUser(userId: number) {
    try {
      const response = await fetch(this.url + "likedmeals/" + userId);
      return await response.json();
    } catch (error) {
      console.error("Error fetching liked meals:", error);
    }
  }

  /**
   * Add a new meal to a user's liked meals
   * @param mealId
   * @param userId 
   */
  async likeMeal(mealId: number, userId: number) {
    try {
      const likedMeals = await this.getByUser(userId);
      if (!likedMeals.some((row: any) => row.meal_id == mealId)) {
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

  /**
   * Delete a row from likedMeals table by it's id
   * @param id Id of the row in likedMeals table
   */
  async deleteLikedMeal(id: number) {
    try {
      fetch(this.url + "likedmeals/" + id, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error("Error deleting liked meal:", error);
    }
  }

  /**
   * Delete a meal from a user's liked meals
   * @param mealId 
   * @param userId 
   */
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
