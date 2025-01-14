import { Component } from '@angular/core';
import { PreferencesComponent } from "../preferences/preferences.component";
import { UsersService } from '../shared/users.service';
import { FamiliesService } from '../shared/families.service';

@Component({
  selector: 'app-user',
  imports: [PreferencesComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  private firstName: string = "";
  private lastName: string = "";
  private familyName: string = "";
  private userType: string = "";
  private email: string = "";
  private family: any[] = [];

  constructor(private usersService: UsersService, private familiesService: FamiliesService) {
    this.fetchUserData();
    this.fetchFamily();
  }

  async fetchUserData() {
    // TODO fetch and display user data
  }

  async fetchFamily() {
    // TODO fetch and display names of family members
    // TODO link to family page
  }
}
