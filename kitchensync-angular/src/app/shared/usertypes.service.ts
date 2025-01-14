import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserTypesService {
  private url = "http://127.0.0.1:8000/api/"

  constructor() { }

  async getAll() {
    try {
      const response = await fetch(this.url + "usertypes");
      return await response.json();
    } catch (error) {
      console.error("Error fetching user types:", error);
    }
  }

  async getOne(id: number) {
    try {
      const response = await fetch(this.url + "usertypes/" + id);
      return await response.json();
    } catch (error) {
      console.error("Error fetching user type:", error);
    }
  }
}
