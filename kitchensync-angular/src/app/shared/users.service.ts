import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private url = "http://127.0.0.1:8000/api/"

  constructor() { }

  async getAll() {
    try {
      const response = await fetch(this.url + "users/");
      return await response.json();
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  async getOne(userId: number) {
    try {
      const response = await fetch(this.url + "users/" + userId);
      return await response.json();
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

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

    window.location.reload();
  }
}
