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
  cuisines: any[] = [];
  mealtimes: any[] = [];
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

  async loadRequests() {
    console.log("loadRequests called");
    this.requestsLoaded = false;
    await this.fetchRequests();

    // Run these functions in parallel and don't continue until all are done
    // TODO recipe title and image
    await Promise.all([this.addRequestMealtimes(), this.addRequestUserNames()]);

    this.requestsLoaded = true;
  }

  async fetchCuisines() {
    this.cuisines = await this.cuisinesService.getAll();
  }

  async fetchMealtimes() {
    this.mealtimes = await this.mealtimesService.getAll();
  }

  async fetchRequests() {
    this.requests = await this.requestsService.getByFamily(this.familyId);

    if (this.userTypeId == 2) { // If child user, filter out requests made by different users
      this.requests = this.requests.filter(request => request.user_id == this.userId);
    }
  }

  // Add names to requests for display
  async addRequestUserNames() {
    let users: any[] = await this.usersService.getAll();
    for (let request of this.requests) {  // For each request, add the full name of the user that made it
      let user = users.find(user => user.id == request.user_id);
      request.user_name = user.first_name + " " + user.last_name;
    }
  }

  // Add mealtimes as strings to requests for display
  async addRequestMealtimes() {
    for (let request of this.requests) {
      request.mealtime = this.mealtimes.find(mealtime => mealtime.id == request.mealtime_id)?.mealtime;
    }
  }

  makeRequest() {
    // Check that either comment or cuisine is included (request must include one or both)
    let comment = (document.getElementById('comment')! as HTMLInputElement).value;
    let date:string | null = (document.getElementById('date') as HTMLInputElement)?.value;
    let mealtime:string | null = (document.getElementById('mealtime-option')! as HTMLSelectElement).value;
    let cuisine:string | null = (document.getElementById('cuisine-option')! as HTMLSelectElement).value;
    console.log(date);

    if (!this.includeDate) {
      date = null;
    }
    if (cuisine == "none") {
      cuisine = null;
    }
    if (mealtime == "none") {
      mealtime = null;
    }

    if (comment.trim().length === 0 && !cuisine) {
      alert("Your request must have at least a comment or cuisine!");
      return;
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
    console.log(newRequest);

    this.requestsService.makeRequest(newRequest);
    alert("Request made!")
  }

  deleteRequest(id: number) {
    const request = this.requests.find(request => request.id == id);
    if (this.userTypeId == 1 || this.userId == request.user_id) {
      this.requestsService.delete(id);
      this.requests = this.requests.filter(otherRequest => otherRequest.id != request.id);  // Update local array
    }
  }
}
