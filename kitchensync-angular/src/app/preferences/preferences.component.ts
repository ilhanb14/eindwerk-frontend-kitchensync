import { Component } from '@angular/core';

@Component({
  selector: 'app-preferences',
  imports: [],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.css'
})
export class PreferencesComponent {
  preferenceList: string[] = [];  // TODO: change type

  constructor() {
    this.fetchPreferences();
  }

  async fetchPreferences() {
    // Temporary static data
    this.preferenceList = ['Vegetarian', 'No peanuts'];
    // TODO: get preferences from db
    // TODO: set options to current values from account_preference table
  }

  async saveChanges() {
    // TODO: read all choices and update db
  }
}
