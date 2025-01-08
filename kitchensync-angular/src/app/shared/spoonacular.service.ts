import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class SpoonacularService {
  private apiUrl = 'https://api.spoonacular.com/';
  private apiKey = 'ebc3c44a221640ca9eeef49f77ce5e1d';

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
      console.error('There was a problem with the fetch operation:', error);
      throw error;
    } 
  }
}
