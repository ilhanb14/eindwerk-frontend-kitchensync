import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CuisinesService {
  private url = "http://127.0.0.1:8000/api/";

  constructor() { }

  async getAll() {
    try {
      const response = await fetch(this.url + "cuisines/");
      return await response.json();
    } catch (error) {
      console.error('Error fetching all cuisines:', error);
    }
  }
}
