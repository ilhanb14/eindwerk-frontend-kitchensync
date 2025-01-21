import { Component } from '@angular/core';
import { UsersService } from '../shared/users.service';
import { RequestsService } from '../shared/requests.service';
import { MealtimesService } from '../shared/mealtimes.service';
import { CuisinesService } from '../shared/cuisines.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-request',
  imports: [RouterLink, FormsModule],
  templateUrl: './request.component.html',
  styleUrl: './request.component.css'
})
export class RequestComponent {
  existingRequests: any[] = [];
  userNames: any[] = [];
  userId: number = Number(sessionStorage.getItem('id'));
  userTypeId: number = Number(sessionStorage.getItem('user_type_id')); // This restricts some actions such as seeing other users's requests
  familyId: number = Number(sessionStorage.getItem('family_id'));
  cuisines: string[] = [];
  mealtimes: any[] = [];
  includeDate = true; // Used to know if date input should be read

  constructor(private usersService: UsersService, private requestsService: RequestsService, private mealtimesService : MealtimesService, private cuisinesService : CuisinesService) {
    this.fetchExistingRequests();
    this.fetchCuisines();
    this.fetchMealtimes();
  }

  async fetchExistingRequests() {
    this.existingRequests = await this.requestsService.getByFamily(this.familyId);
    if (this.userTypeId == 2) { // If child user, filter out requests made by different users
      this.existingRequests = this.existingRequests.filter(request => request.user_id == this.userId);
    }

    // Get mealtimes and assign to each request
    this.mealtimesService.getAll().then(response => {
      for (let request of this.existingRequests) {
        if (request.mealtime_id) {
          request.mealtime = response.find((mealtime: any) => mealtime.id == request.mealtime_id).mealtime;
        }
      }
    })

    // TODO fetch meal title and image from spoonacular for requests with specific meals

    // Get list of names of users who have made requests, this is used to display names with requests
    let userIds = this.existingRequests.map(request => request.user_id);  // userIds for each request, contains duplicates
    let users = await this.usersService.getAll().then(result => result.filter((user: any) => userIds.some(id => user.id == id)));  // Get all users whose id is in userIds
    this.userNames = users.map((user: any) => {return {id: user.id, fullName: user.first_name + " " + user.last_name}});
  }

  async fetchCuisines() {
    let response = await this.cuisinesService.getAll();
    this.cuisines = response.map((cuisine: any) => cuisine.name);
  }

  async fetchMealtimes() {
    this.mealtimes = await this.mealtimesService.getAll();
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
    const request = this.existingRequests.find(request => request.id == id);
    if (this.userTypeId == 1 || this.userId == request.user_id) {
      this.requestsService.delete(id);
      this.existingRequests = this.existingRequests.filter(otherRequest => otherRequest.id != request.id);  // Update local array
    }
  }
}
