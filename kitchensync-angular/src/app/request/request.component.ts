import { Component } from '@angular/core';
import { UsersService } from '../shared/users.service';
import { RequestsService } from '../shared/requests.service';
import { MealtimesService } from '../shared/mealtimes.service';
import { CuisinesService } from '../shared/cuisines.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SpoonacularService } from '../shared/spoonacular.service';

@Component({
  selector: 'app-request',
  imports: [RouterLink, FormsModule],
  templateUrl: './request.component.html',
  styleUrl: './request.component.css'
})
export class RequestComponent {
  requests: any[] = [];
  userId: number = Number(sessionStorage.getItem('id'));
  userTypeId: number = Number(sessionStorage.getItem('user_type_id')); // This restricts some actions such as seeing other users's requests
  familyId: number = Number(sessionStorage.getItem('family_id'));
  cuisines: any[] = []; // Will hold all cuisine options
  mealtimes: any[] = [];  // Will hold all mealtime options
  includeDate = true; // Used to know if date input should be read
  requestsLoaded = false;

  constructor(
    private usersService: UsersService, private requestsService: RequestsService,
    private mealtimesService: MealtimesService, private cuisinesService : CuisinesService,
    private spoonacularService: SpoonacularService) {
    // Get all cuisines and mealtimes from database
    // Mealtimes are also used in loadRequests so each request has it's mealtime as a string
    this.fetchCuisines();
    this.fetchMealtimes().then(response => this.loadRequests());
  }

  /**
   * Load existing requests and add extra data (mealtime, user name, meal title and image) needed for display
   */
  async loadRequests() {
    this.requestsLoaded = false;
    await this.fetchRequests();

    // Run these functions in parallel and don't continue until all are done
    await Promise.all([this.addRequestMealtimes(), this.addRequestUserNames(), this.addRequestMealData()]);

    this.requestsLoaded = true;
  }

  /**
   * Fetch all cuisine options and store in this.cuisines
   */
  async fetchCuisines() {
    this.cuisines = await this.cuisinesService.getAll();
  }

  /**
   * Fetch all mealtime options and store in this.mealtimes
   */
  async fetchMealtimes() {
    this.mealtimes = await this.mealtimesService.getAll();
  }

  /**
   * Get existing requests for this family,
   * if user is child filter to only their own requests
   */
  async fetchRequests() {
    this.requests = await this.requestsService.getByFamily(this.familyId);

    if (this.userTypeId == 2) { // If child user, filter out requests made by different users
      this.requests = this.requests.filter(request => request.user_id == this.userId);
    }
  }

  /**
   * Get user names and assign them to each request for display
   */
  async addRequestUserNames() {
    let users: any[] = await this.usersService.getAll();
    for (let request of this.requests) {  // For each request, add the full name of the user that made it
      let user = users.find(user => user.id == request.user_id);
      request.user_name = user.first_name + " " + user.last_name;
    }
  }

  /**
   * Assign mealtime strings to each request for display
   */
  async addRequestMealtimes() {
    for (let request of this.requests) {
      request.mealtime = this.mealtimes.find(mealtime => mealtime.id == request.mealtime_id)?.mealtime;
    }
  }

  /**
   * Get recipe data for requests (title, image) and assign to each request for display
   */
  async addRequestMealData() {
    // Make list of meal ids to fetch in bulk
    let mealIds: number[] = [];
    for (let request of this.requests) {
      if (request.meal_id)
        mealIds.push(request.meal_id);
    }

    // Add title and image values to requests that have a specific meal
    let meals: any[] = await this.spoonacularService.getMealsById(mealIds);
    for (let request of this.requests) {
      let meal = meals.find(meal => meal.id == request.meal_id);
      if (meal) {
        request.meal_title = meal.title;
        request.meal_image = meal.image;
      }
    }
  }

  /**
   * Make a request from input values
   */
  makeRequest() {
    let comment = (document.getElementById('comment')! as HTMLInputElement).value;
    let date:string | null = (document.getElementById('date') as HTMLInputElement)?.value;
    let mealtime:string | null = (document.getElementById('mealtime-option')! as HTMLSelectElement).value;
    let cuisine:string | null = (document.getElementById('cuisine-option')! as HTMLSelectElement).value;
    console.log(date);

    if (!this.includeDate) {  // If checkbox to include date is not checked
      date = null;  // Do not include date with request
    }
    if (cuisine == "none") {
      cuisine = null; // Do not include cuisine
    }
    if (mealtime == "none") {
      mealtime = null;  // Do not include mealtime
    }

    // Check that either comment or cuisine is included (request must include one or both)
    if (comment.trim().length === 0 && !cuisine) {
      alert("Your request must have at least a comment or cuisine!");
      return; // Do not make request
    }

    let newRequest = {
      user_id: this.userId,
      family_id: this.familyId,
      // These next values will be included but some might be null or "" which is fine
      mealtime_id: mealtime,
      cuisine: cuisine,
      comment: comment,
      date: date
    }

    this.requestsService.makeRequest(newRequest); // Post request to db
    alert("Request made!")
  }

  /**
   * Delete a request by it's id, triggered by delete buttons
   * @param id 
   */
  deleteRequest(id: number) {
    const request = this.requests.find(request => request.id == id);
    if (this.userTypeId == 1 || this.userId == request.user_id) {
      this.requestsService.delete(id);
      this.requests = this.requests.filter(otherRequest => otherRequest.id != request.id);  // Update local array
    }
  }
}
