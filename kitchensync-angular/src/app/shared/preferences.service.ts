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

  async getPreferenceById(id: number) {
    try { 
      const response = await fetch(this.url + "preferences/" + id);
      return await response.json();
    } catch (error) {
      console.error("Error fetching preference by id:", error);
    }
  }

  async getAllUserPreferences(userId: number) {
    try {
      const response = await fetch(this.url + "preferenceuser/" + userId);
      return await response.json();
    } catch (error) {
      console.error("Error fetching user preferences:", error);
    }
  }
}
