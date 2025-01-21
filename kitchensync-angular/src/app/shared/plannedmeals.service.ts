import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlannedMealsService {
  private url = "http://127.0.0.1:8000/api/";

  constructor() { }

  async getByFamily(familyId: number) {
    try {
      const response = await fetch(this.url + "plannedmeals/" + familyId);
      return await response.json();
    } catch (error) {
      console.error("Error getting planned meals by family:", error);
    }
  }
}
