import { Component } from '@angular/core';
import { PreferencesComponent } from "../preferences/preferences.component";

@Component({
  selector: 'app-user',
  imports: [PreferencesComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

}
