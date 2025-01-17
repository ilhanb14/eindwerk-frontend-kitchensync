import { Component } from '@angular/core';
import { UsersService } from '../shared/users.service';
import { RequestsService } from '../shared/requests.service';

@Component({
  selector: 'app-request',
  imports: [],
  templateUrl: './request.component.html',
  styleUrl: './request.component.css'
})
export class RequestComponent {
  existingRequests: any[] = [];
  userNames: any[] = [];
  userId: number = Number(sessionStorage.getItem('id'));
  userTypeId: number = Number(sessionStorage.getItem('user_type_id')); // This restricts some actions such as seeing other users's requests
  familyId: number = Number(sessionStorage.getItem('family_id'));

  constructor(private usersService: UsersService, private requestsService: RequestsService) {
    this.fetchExistingRequests();
  }

  async fetchExistingRequests() {
    this.existingRequests = await this.requestsService.getByFamily(this.familyId);
    if (this.userTypeId == 2) { // If child user, filter out requests made by different users
      this.existingRequests = this.existingRequests.filter(request => request.user_id == this.userId);
    }

    // Get list of names of users who have made requests, this is used to display names with requests
    let userIds = this.existingRequests.map(request => request.user_id);  // userIds for each request, contains duplicates
    let users = await this.usersService.getAll().then(result => result.filter((user: any) => userIds.some(id => user.id == id)));  // Get all users whose id is in userIds
    this.userNames = users.map((user: any) => {return {id: user.id, fullName: user.first_name + " " + user.last_name}});
  }

  
}
