import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class SpoonacularService {
  private apiUrl = 'https://api.spoonacular.com/';
  private apiKey = '8a200140dea34316bf1b269f31c2b785';

  constructor() { }

  /**
   * A function to get some random meals based on a keyword
   * @param query contains the keyword you want to search for and a number for the amount of results you want
   * @returns An object containing an array of meals with the id, title and an image
   */
  async getRecipes(query: { [key: string]: string | number }) {
    try {
      const queryParams = new URLSearchParams(
        Object.fromEntries(
          Object.entries(query).map(([key, value]) => [key, String(value)])
        )
      ).toString();
  
      const response = await fetch(`${this.apiUrl}/recipes/complexSearch?${queryParams}`,  {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('data:', data);
      return data;
    } catch (error) {
      console.error('There was a problem with the getRecipes fetch operation:', error);
      throw error;
    } 
  }

  /**
   * Get a specific meal from spoonacular with all information
   * @param id id of the meal you want more information for
   * @param includeNutrition true if you want nutrition information, true by default
   * @returns data on the specific meal you requested
   */
  async getMealById(id: number, includeNutrition: boolean = true) {
    try {      
      const response = await fetch(`${this.apiUrl}/recipes/${id}/information?includeNutrition=${includeNutrition ? "true" : "false"}`,  {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('data:', data);
      return data;
    } catch (error) {
      console.error('There was a problem with the getMealById fetch operation:', error);
      throw error;
    } 
  }

  /**
   * Get multiple specific meals from spoonacular based on an array of ids, only get id, title and image
   * @param ids ids of the meals you want more information for
   * @returns the id title and image of the meals you wanted information for
   */
  async getMealsById(ids: number[]) {
    try {
      let idsString: string = ""
      for (let id of ids) { // Add all ids seperated by commas
        idsString += id + ",";
      }
      idsString = idsString.substring(0, idsString.length - 1); // Cut off last comma
      
      const response = await fetch(`${this.apiUrl}/recipes/informationBulk?ids=${idsString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching spoonacular informationBulk:", error);
    }
  }

  /**
   * Get some completely random meals
   * @param count number of meals you want
   * @returns An array of meals
   */
  async getRandomMeals(count: number) {
    try {
      const response = await fetch(`${this.apiUrl}/recipes/random?number=${count}&includeNutrition=false`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching random recipes:", error);
    }
  }
}
