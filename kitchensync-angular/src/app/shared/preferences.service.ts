import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  private url = "http://127.0.0.1:8000/api/";

  constructor() { }

  /**
   * Get all stored preference options
   * @returns Array of preferences as {id, name, allergy}
   */
  async getAllPreferences() {
    try {
      const response = await fetch(this.url + "preferences/");
      return await response.json();
    } catch (error) {
      console.error('Error fetching all preferences:', error);
      throw error;
    }
  }

  /**
   * Get stored preference option by id
   * @param id 
   * @returns Preference as {id, name, allergy}
   */
  async getPreferenceById(id: number) {
    try { 
      const response = await fetch(this.url + "preferences/" + id);
      return await response.json();
    } catch (error) {
      console.error("Error fetching preference by id:", error);
    }
  }

  /**
   * Get all of a specific user's preferences
   * @param userId 
   * @returns User preference as {id, name, allergy, pivot: {user_id, preference_id, important}}
   */
  async getAllUserPreferences(userId: number) {
    try {
      const response = await fetch(this.url + "preferenceuser/" + userId);
      return await response.json();
    } catch (error) {
      console.error("Error fetching user preferences:", error);
    }
  }

  /**
   * Add a new preference for a specific user
   * @param userId 
   * @param preferenceId 
   * @param important Boolean, by default false
   */
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

  /**
   * Delete a preference for a specific user
   * @param userId 
   * @param preferenceId 
   */
  async deleteUserPreference(userId: number, preferenceId: number) {
    try {
      await fetch(this.url + "preferenceuser/" + userId + "/" + preferenceId, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error("Error deleting user preference:", error);
    }
  }

  /**
   * Toggle wether a preference is important to a specific user
   * @param userId 
   * @param preferenceId 
   */
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
