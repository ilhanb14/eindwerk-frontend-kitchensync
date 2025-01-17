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

  // Make a request for a specific meal, mealtime and comment optional
  async requestWithMeal(date: Date, familyId: number, userId: number, mealId: number, comment: string = "", mealtimeId = undefined) {

  }

  // Make a request for a specific cuisine, mealtime and comment optional
  async requestWithCuisine(date: Date, familyId: number, userId: number, cuisine: string, comment: string = "", mealtimeId = undefined) {

  }

  // Make a request with comment only, mealtime optional
  async requestWithComment(date: Date, familyId: number, userId: number, comment: string, mealtimeId = undefined) {

  }

  // Update an existing request
  async put(id: number, date: Date, familyId: number, userId: number, mealId: number|undefined, cuisine: string|undefined, comment: string|undefined, mealtimeId: number|undefined) {
    // TODO check that at least one of mealId, cuisine, or comment is not undfined or empty
  }

  async delete(id: number) {

  }
}
