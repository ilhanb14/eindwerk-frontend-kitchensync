import { Component } from '@angular/core';
import { FamiliesService } from '../shared/families.service';
import { UsersService } from '../shared/users.service';
import { FormsModule } from '@angular/forms';
import { InvitationComponent } from "../invitation/invitation.component";

@Component({
  selector: 'app-family',
  imports: [FormsModule, InvitationComponent],
  templateUrl: './family.component.html',
  styleUrl: './family.component.css'
})

export class FamilyComponent {
  userId: number = Number(sessionStorage.getItem('id'));
  family: any[] | null = null;
  loading = true; // Show loading message
  error: string | null = null;
  familyId: number | null = null;
  familyName!: string;

  constructor(
    private familiesService: FamiliesService,
    private usersService: UsersService,
  ) { 
    this.getFamily()
  }

  async getFamily() {
    this.loading = true; // Show loading message
    this.error = null; // Reset error

    try {
      const user = await this.usersService.getOne(this.userId);

      this.familyId = user.family_id

      if (this.familyId) {
        this.family = await this.familiesService.getUsersInFamily(this.familyId);
        console.log('Fetched family:', this.family)
      }

    } catch (err) {
      this.error = 'Failed to load family.';
    } finally {
      this.loading = false; // Hide loading message
    }
  }

  async createFamily(naam: string) {
    const response = await this.familiesService.addFamily(naam);

    console.log(response);

    this.familyId = Number(response.family_id);

    console.log(this.familyId);

    this.usersService.assignFamily(this.familyId)
  }
}
