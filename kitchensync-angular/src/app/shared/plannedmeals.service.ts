import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlannedMealsService {
  private url = "http://127.0.0.1:8000/api/";

  constructor() { }

  async getByFamily(familyId: number) {
    try {
      const response = await fetch(this.url + "plannedmeals/" + familyId);
      return await response.json();
    } catch (error) {
      console.error("Error getting planned meals by family:", error);
    }
  }

  async getByFamilyAndDate(familyId: number, date: Date) {
    try {
      const response = await fetch(this.url + "plannedmeals/" + familyId + "/" + date.toISOString().split('T')[0]);
      return await response.json();
    } catch (error) {
      console.error("Error getting planned meals by family:", error);
    }
  }

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
          date: date.toISOString().split('T')[0],
          mealtime_id: mealtimeId,
          servings: servings
        })
      });
    } catch (error) {
      console.error("Error posting planned meal:", error);
    }
  }

  async deletePlannedMeal(id: number) {
    try {
      fetch(this.url + "plannedmeals/" + id, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error("Error getting planned meals by family:", error);
    }
  }

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
          date: date.toISOString().split('T')[0],
          mealtime_id: mealtimeId,
          servings: servings
        })
      });
    } catch (error) {
      console.error("Error posting planned meal:", error);
    }
  }
}
