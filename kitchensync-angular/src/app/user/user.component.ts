import { Component } from '@angular/core';
import { PreferencesComponent } from "../preferences/preferences.component";
import { UsersService } from '../shared/users.service';
import { FamiliesService } from '../shared/families.service';
import { UserTypesService } from '../shared/usertypes.service';
import { LikedMealsComponent } from "../likedmeals/likedmeals.component";
import { User } from '../interfaces/user';

@Component({
  selector: 'app-user',
  imports: [PreferencesComponent, LikedMealsComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  firstName: string = "";
  lastName: string = "";
  familyName: string | null = null;
  userType: string | null= null;
  email: string = "";
  family: any[] = [];
  private userId: number = Number(sessionStorage.getItem('id'))

  constructor(private usersService: UsersService, private familiesService: FamiliesService, private userTypesService : UserTypesService) {
    this.fetchUserData();
  }

  /**
   * Get data for current user
   */
  async fetchUserData() {
    const userData = await this.usersService.getOne(this.userId);

    if (userData.family_id) {
      this.fetchFamily(userData.family_id);
    }

    this.firstName = userData.first_name;
    this.lastName = userData.last_name;
    this.email = userData.email;

    if (userData.user_type_id) {
      this.userTypesService.getOne(userData.user_type_id).then(result => this.userType = result.type);
    }
  }

  /**
   * Get all members of user's family
   * @param familyId 
   */
  async fetchFamily(familyId: number) {
    // Get the correct family name
    this.familiesService.getById(familyId).then(result => this.familyName = result.name);

    // Get all users in the family
    const response = await this.familiesService.getUsersInFamily(familyId);
    this.family = await response.filter((user: User) => user.id != this.userId);
  }
}
