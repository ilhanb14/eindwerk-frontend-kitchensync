import { Injectable } from '@angular/core';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class FamiliesService {
  private url = "http://127.0.0.1:8000/api/"

  constructor(private usersService: UsersService) { }

  async getById(id: number) {
    try {
      const response = await fetch(this.url + "families/" + id);
      return await response.json();
    } catch(error) {
      console.error("Error fetching family by id:", error);
    }
  }

  async addFamily(familyName: string) {
    try {
      const response = await fetch(this.url + "families", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: familyName
        })
      });

      const data = await response.json();

      return data;

    } catch(error) {
      console.error("Error adding family:", error);
    }
  }

  async updateFamily(familyId: number, familyName: string) {
    try {
      await fetch(this.url + "families/" + familyId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: familyName
        })
      });
    } catch(error) {
      console.error("Error updating family:", error);
    }
  }

  async deleteFamily(familyId: number) {
    try {
      await fetch(this.url + "families/" + familyId, {
        method: 'DELETE'
      })
    } catch(error) {
      console.error("Error deleting family:", error);
    }
  }

  async getUsersInFamily(familyId: number) {
    let allUsers: any[] = await this.usersService.getAll();
    return allUsers.filter(user => user.family_id === familyId);
  }
}
