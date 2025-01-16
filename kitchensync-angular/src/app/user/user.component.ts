import { Component } from '@angular/core';
import { PreferencesComponent } from "../preferences/preferences.component";
import { UsersService } from '../shared/users.service';
import { FamiliesService } from '../shared/families.service';
import { UserTypesService } from '../shared/usertypes.service';
import { LikedMealsComponent } from "../likedmeals/likedmeals.component";

@Component({
  selector: 'app-user',
  imports: [PreferencesComponent, LikedMealsComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  firstName: string = "";
  lastName: string = "";
  familyName: string = "";
  userType: string = "";
  email: string = "";
  family: any[] = [];
  private userId: number = Number(sessionStorage.getItem('id'))

  constructor(private usersService: UsersService, private familiesService: FamiliesService, private userTypesService : UserTypesService) {
    this.fetchUserData();
  }

  async fetchUserData() {
    const userData = await this.usersService.getOne(this.userId);

    this.fetchFamily(userData.family_id);

    this.firstName = userData.first_name;
    this.lastName = userData.last_name;
    this.email = userData.email;

    this.userTypesService.getOne(userData.user_type_id).then(result => this.userType = result.type);
  }

  async fetchFamily(familyId: number) {
    this.familiesService.getById(familyId).then(result => this.familyName = result.name);

    this.familiesService.getUsersInFamily(familyId).then(result => this.family = result.filter(user => user.id != this.userId));
    
    // TODO link to family page
  }
}
