import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private url = "http://127.0.0.1:8000/api/"

  constructor() { }

  /**
   * Get all users
   * @returns an array of all users
   */
  async getAll() {
    try {
      const response = await fetch(this.url + "users/");
      return await response.json();
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  /**
   * Get one specific user based on id
   * @param userId id of the user you want more information for
   * @returns information on the specific user
   */
  async getOne(userId: number) {
    try {
      const response = await fetch(this.url + "users/" + userId);
      return await response.json();
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  /**
   * Change the family of the logged in user
   * @param familyId id of the family you want to assign
   */
  async assignFamily(familyId: number) {
    const userId = sessionStorage.getItem('id');
    console.log("User ID:", userId, "Family ID:", familyId);
    try {
      await fetch(this.url + `users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          family_id: familyId
        })
      });
    } catch (error) {
      console.error("Error assigning family to user:", error);
    }

    // reload the page to show the members of the enw family
    window.location.reload();
  }

  /**
   * Cha,nge the user type of someone
   * @param userId the user you want to change the type of
   * @param userTypeId the id of the user type you want to assign
   */
  async assignType(userId: number, userTypeId: number) {
    console.log("User ID:", userId, "Family ID:", userTypeId);
    try {
      await fetch(this.url + `users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_type_id: userTypeId
        })
      });
    } catch (error) {
      console.error("Error assigning family to user:", error);
    }
  }

  /**
   * Remove a user from the family of the current user
   * @param userId the id of the user you want to remove from the family
   */
  async removeFromFamily(userId: number) {
    try {
      await fetch(this.url + `users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          family_id: null
        })
      });
    } catch (error) {
      console.error("Error assigning family to user:", error);
    }
  }
}
