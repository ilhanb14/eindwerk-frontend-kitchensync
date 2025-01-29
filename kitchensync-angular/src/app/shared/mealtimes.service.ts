import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MealtimesService {
  private url = "http://127.0.0.1:8000/api/";

  constructor() { }

  /**
   * Get all stored mealtime options
   * @returns Array of mealtimes as {id, mealtime}
   */
  async getAll() {
    try {
      const response = await fetch(this.url + "mealtimes/");
      return await response.json();
    } catch (error) {
      console.error('Error fetching all mealtimes:', error);
    }
  }

  /**
   * Get a specific mealtime by id
   * @param id 
   * @returns Mealtime as {id, mealtime}
   */
  async getOne(id: number) {
    try {
      const response = await fetch(this.url + "mealtimes/" + id);
      return await response.json();
    } catch (error) {
      console.error('Error fetching mealtime:', error);
    }
  }
}
