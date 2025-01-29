import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ClickOutsideDirective } from '../click-outside.directive';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ClickOutsideDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isDropdownOpen = false; // Dropdown is by default not shown

  /**
   * Change whether the dropdown menu is shown
   */
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  /**
   * Closes the dropdown menu
   */
  closeDropdown() {
    this.isDropdownOpen = false;
  }

}
