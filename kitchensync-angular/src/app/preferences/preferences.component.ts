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

  /**
   * Get all preference options from db for display and get all userPreferences for current user to set default checkbox values
   */
  async fetchPreferences() {
    // get preferences from db
    this.preferenceList = await this.preferencesService.getAllPreferences();
    // set options to current values from user_preference table
    this.userPreferences = await this.preferencesService.getAllUserPreferences(this.userId);
    this.setCheckboxValues();
  }

  /**
   * Set values of all checkboxes for preferences based on data in this.userPreferences
   */
  setCheckboxValues() {
    // set checkboxes based on values in userPrefences
    for (const preference of this.preferenceList) {
      let prefCheckbox = document.getElementById('check-'+preference.id)! as HTMLInputElement; // checkbox for this preference
      let importantCheckbox = document.getElementById('important-'+preference.id)! as HTMLInputElement; // checkbox that marks this preference as important
      let currentUserPreference = this.userPreferences.find(userPref => userPref.id === preference.id); // userPreference if it already exists for this user

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

  /**
   * Save changes to db based on checkbox inputs
   */
  async saveChanges() {
    for (const preference of this.preferenceList) {
      let prefCheckbox = document.getElementById('check-'+preference.id)! as HTMLInputElement; // checkbox for this preference
      let importantCheckbox = document.getElementById('important-'+preference.id)! as HTMLInputElement; // checkbox that marks this preference as important
      let savedUserPreference = this.userPreferences.find(userPref => userPref.id === preference.id)  // userPreference if it already exists for this user


      if (prefCheckbox.checked && !savedUserPreference) {  // if checked and not already saved
        await this.preferencesService.addUserPreference(this.userId, preference.id, importantCheckbox.checked); // add new userPreference
      } else if (!prefCheckbox.checked && savedUserPreference) {  // if unchecked, but is saved
        await this.preferencesService.deleteUserPreference(this.userId, preference.id); // Remove from userPreferences
      } else if (prefCheckbox.checked && savedUserPreference.pivot.important != importantCheckbox.checked) {  // if checked, already saved, important changed
        await this.preferencesService.toggleImportant(this.userId, preference.id);  // toggle important on this userPreference
      }
    }

    this.userPreferences = await this.preferencesService.getAllUserPreferences(this.userId);
  }

  /**
   * Event when a preference checkbox is toggled, used to toggle if importantCheckbox is enabled
   * @param preferenceId 
   */
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
