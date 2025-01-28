import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlannedMealsService {
  private url = "http://127.0.0.1:8000/api/";

  constructor() { }

  /**
   * Get all planned meals for a specific family
   * @param familyId 
   * @returns Array of planned meals as {id, meal_id, family_id, date, mealtime_id, servings}
   */
  async getByFamily(familyId: number) {
    try {
      const response = await fetch(this.url + "plannedmeals/" + familyId);
      return await response.json();
    } catch (error) {
      console.error("Error getting planned meals by family:", error);
    }
  }

  /**
   * Get all planned meals for a family on a specific date
   * @param familyId 
   * @param date 
   * @returns Array of planned meals as {id, meal_id, family_id, date, mealtime_id, servings}
   */
  async getByFamilyAndDate(familyId: number, date: Date) {
    try {
      const response = await fetch(this.url + "plannedmeals/" + familyId + "/" + date.toISOString().split('T')[0]);
      return await response.json();
    } catch (error) {
      console.error("Error getting planned meals by family:", error);
    }
  }

  /**
   * Add a new planned meal
   * @param mealId 
   * @param familyId 
   * @param date 
   * @param mealtimeId 
   * @param servings 
   */
  async post(mealId: number, familyId: number, date: Date, mealtimeId: number, servings: number) {
    try {
      const response = await fetch(this.url + "plannedmeals", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          meal_id: mealId,
          family_id: familyId,
          date: date.toISOString().split('T')[0], // Convert Date object to string as DD-MM-YYYY
          mealtime_id: mealtimeId,
          servings: servings
        })
      });
    } catch (error) {
      console.error("Error posting planned meal:", error);
    }
  }

  /**
   * Delete a planned meal by it's id
   * @param id Id of entry in PlannedMeals table
   */
  async deletePlannedMeal(id: number) {
    try {
      fetch(this.url + "plannedmeals/" + id, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error("Error getting planned meals by family:", error);
    }
  }

  /**
   * Edit existing planned meal
   * @param id Id of entry in PlannedMeals table
   * @param mealId 
   * @param familyId 
   * @param date 
   * @param mealtimeId 
   * @param servings 
   */
  async put(id: number, mealId: number, familyId: number, date: Date, mealtimeId: number, servings: number) {
    try {
      const response = await fetch(this.url + "plannedmeals/" + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          meal_id: mealId,
          family_id: familyId,
          date: date.toISOString().split('T')[0], // Convert Date object to string as DD-MM-YYYY
          mealtime_id: mealtimeId,
          servings: servings
        })
      });
    } catch (error) {
      console.error("Error posting planned meal:", error);
    }
  }
}
