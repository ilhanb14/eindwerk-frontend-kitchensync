import { Component } from '@angular/core';
import { FamiliesService } from '../shared/families.service';
import { UsersService } from '../shared/users.service';

@Component({
  selector: 'app-family',
  imports: [],
  templateUrl: './family.component.html',
  styleUrl: './family.component.css'
})

export class FamilyComponent {
  userId: number = Number(sessionStorage.getItem('id'));
  family: any[] = [];
  loading = true; // Show loading message
  error: string | null = null;
  familyId: number = 0;


  constructor(
    private familiesService: FamiliesService,
    private usersService: UsersService
  ) { 
    this.getFamily()
  }

  async getFamily() {
    this.loading = true; // Show loading message
    this.error = null; // Reset error

    try {
      const user = await this.usersService.getOne(this.userId);

      this.familyId = user.family_id

      this.family = await this.familiesService.getUsersInFamily(this.familyId);

      console.log('Fetched family:', this.family)

    } catch (err) {
      this.error = 'Failed to load family.';
    } finally {
      this.loading = false; // Hide loading message
    }
  }
}
