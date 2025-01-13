import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  private url = "http://127.0.0.1:8000/api/";

  constructor() { }

  async getAllPreferences() {
    try {
      const response = await fetch(this.url + "preferences/");
      return await response.json();
    } catch (error) {
      console.error('Error fetching all preferences:', error);
      throw error;
    }
  }
}
