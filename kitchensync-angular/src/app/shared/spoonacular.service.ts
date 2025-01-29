import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class SpoonacularService {
  private apiUrl = 'https://api.spoonacular.com/';
  private apiKey = '8a200140dea34316bf1b269f31c2b785';

  constructor() { }

  async getRecipes(query: { [key: string]: string | number }) {
    try {
      const queryParams = new URLSearchParams({
        ...query,
        apiKey: this.apiKey
      }).toString();
  
      const response = await fetch(`${this.apiUrl}/recipes/complexSearch?${queryParams}`,  {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('There was a problem with the getRecipes fetch operation:', error);
      throw error;
    } 
  }

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

      return await response.json();
    } catch (error) {
      console.error("Error fetching random recipes:", error);
    }
  }
}
