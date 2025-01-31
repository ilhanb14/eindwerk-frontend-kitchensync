import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private url = "http://127.0.0.1:8000/api/";

  constructor() { }

  /**
   * Get all requests made by members of a specific family
   * @param familyId
   * @returns Array of requests as {id, user_id, family_id, date, mealtime_id, comment, meal_id, cuisine_id}
   */
  async getByFamily(familyId: number) {
    try {
      const response = await fetch(this.url + "requests/" + familyId);
      return await response.json();
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  }

  /**
   * Add a new request
   * @param request Object with {user_id, family_id, date, mealtime_id, comment, meal_id, cuisine_id}
   * - date and mealtime are optional
   * - Should include at least one of comment, meal_id, cuisine
   */
  async makeRequest(request: any) {
    try {
      fetch(this.url + "requests/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      })
    } catch (error) {
      console.error("Error making request:", error);
    }
  }

  /**
   * Delete a request by it's id
   * @param id 
   */
  async delete(id: number) {
    try {
      fetch(this.url + "requests/" + id, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  }
}
