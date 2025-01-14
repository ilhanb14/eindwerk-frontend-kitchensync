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

    async addUserPreference(userId: number, preferenceId: number, important: boolean = false) {
      try {
        await fetch(this.url + "preferenceuser", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: userId,
            preference_id: preferenceId,
            important: important
          })
        });
      } catch (error) {
        console.error("Error adding user preference:", error);
      }
    }
  
    async deleteUserPreference(userId: number, preferenceId: number) {
      try {
        await fetch(this.url + "preferenceuser/" + userId + "/" + preferenceId, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error("Error deleting user preference:", error);
      }
    }
  
    async toggleImportant(userId: number, preferenceId: number) {
      try {
        await fetch(this.url + "preferenceuser/" + userId + "/" + preferenceId, {
          method: 'PUT'
        });
      } catch(error) {
        console.error("Error toggling important preference:", error);
      }
    }
}
