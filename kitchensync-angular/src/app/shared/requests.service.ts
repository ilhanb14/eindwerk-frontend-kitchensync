import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private url = "http://127.0.0.1:8000/api/";

  constructor() { }

  async getByFamily(familyId: number) {
    try {
      const response = await fetch(this.url + "requests/" + familyId);
      return await response.json();
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  }

  // Make a request for a request, date and mealtime are optional, must include at least one of meal_id, cuisine, or comment
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

  // Update an existing request
  async put(id: number, date: Date, familyId: number, userId: number, mealId: number|undefined, cuisine: string|undefined, comment: string|undefined, mealtimeId: number|undefined) {
    // TODO check that at least one of mealId, cuisine, or comment is not undfined or empty
  }

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
