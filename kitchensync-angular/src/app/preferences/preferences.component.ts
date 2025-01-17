import { Component } from '@angular/core';
import { PreferencesService } from '../shared/preferences.service';

@Component({
  selector: 'app-preferences',
  imports: [],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.css'
})
export class PreferencesComponent {
  preferenceList: any[] = [];  // TODO: change type
  userPreferences: any[] = [];
  userId: number = Number(sessionStorage.getItem('id')) || 0;

  constructor(private preferencesService: PreferencesService) {
    this.fetchPreferences();
  }

  async fetchPreferences() {
    // get preferences from db
    this.preferenceList = await this.preferencesService.getAllPreferences();
    // set options to current values from user_preference table
    this.userPreferences = await this.preferencesService.getAllUserPreferences(this.userId);  // TODO: user id based on currently logged in user
    this.setCheckboxValues();
  }

  setCheckboxValues() {
    // set checkboxes based on values in userPrefences
    for (const preference of this.preferenceList) {
      let prefCheckbox = document.getElementById('check-'+preference.id)! as HTMLInputElement; // checkbox for this preference
      let importantCheckbox = document.getElementById('important-'+preference.id)! as HTMLInputElement; // checkbox that marks this preference as important
      let currentUserPreference = this.userPreferences.find(userPref => userPref.id === preference.id);

      // if user has this preference
      if (currentUserPreference) {
        prefCheckbox.checked = true;
        importantCheckbox.disabled = false; // important checkbox should be togglable if preference is selected
        if (currentUserPreference.pivot.important) {  // if the user has marked this preference as important
          importantCheckbox.checked = true;
        }
      }
    }
  }

  async saveChanges() {
    for (const preference of this.preferenceList) {
      let prefCheckbox = document.getElementById('check-'+preference.id)! as HTMLInputElement; // checkbox for this preference
      let importantCheckbox = document.getElementById('important-'+preference.id)! as HTMLInputElement; // checkbox that marks this preference as important
      let savedUserPreference = this.userPreferences.find(userPref => userPref.id === preference.id)


      if (prefCheckbox.checked && !savedUserPreference) {  // if checked and not already saved
        await this.preferencesService.addUserPreference(this.userId, preference.id, importantCheckbox.checked);
      } else if (prefCheckbox.checked && savedUserPreference.pivot.important != importantCheckbox.checked) {  // if checked, already saved, important changed
        await this.preferencesService.toggleImportant(this.userId, preference.id);
      } else if (!prefCheckbox.checked && savedUserPreference) {  // if unchecked, but is saved
        await this.preferencesService.deleteUserPreference(this.userId, preference.id);
      }
    }

    this.userPreferences = await this.preferencesService.getAllUserPreferences(this.userId);
  }

  preferenceToggled(preferenceId: number) {
    let prefCheckbox = document.getElementById('check-'+preferenceId)! as HTMLInputElement;
    let importantCheckbox = document.getElementById('important-'+preferenceId)! as HTMLInputElement; // checkbox that marks this preference as important
    
    if(prefCheckbox.checked) {
      importantCheckbox.disabled = false;
    } else {
      importantCheckbox.disabled = true;
      importantCheckbox.checked = false;
    }
  }
}
