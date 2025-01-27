import { Component, signal } from '@angular/core';
import { FamiliesService } from '../shared/families.service';
import { UsersService } from '../shared/users.service';
import { FormsModule } from '@angular/forms';
import { InvitationComponent } from "../invitation/invitation.component";
import { InvitationsService } from '../shared/invitations.service';

@Component({
  selector: 'app-family',
  imports: [FormsModule, InvitationComponent],
  templateUrl: './family.component.html',
  styleUrl: './family.component.css'
})

export class FamilyComponent {
  userId: number = Number(sessionStorage.getItem('id'));
  userType: number = Number(sessionStorage.getItem('user_type_id'));
  family = signal<any[]>([]);
  loading = true; // Show loading message
  error: string | null = null;
  familyId: number | null = null;
  familyName!: string;
  emailInvite!: string;
  inviteMessage: string = '';

  constructor(
    private familiesService: FamiliesService,
    private usersService: UsersService,
    private invitationsService: InvitationsService,
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
        const members  = await this.familiesService.getUsersInFamily(this.familyId);
        this.family.set(members);
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

  async invite(emailInvite: string) {
    // Reset inviteMessage
    this.inviteMessage = '';

    // Call the invite function. This will add an invitation and return a message
    const response = await this.invitationsService.invite(emailInvite, String(this.userId), String(this.familyId));

    // Display the message
    this.inviteMessage = await response.message;
  }

  async changeUserType(userId: number, userTypeId: number) {
    try {
      const response = await this.usersService.assignType(userId, userTypeId);
      console.log(response)
  
      this.family.update((members) =>
        members.map((member) =>
          member.id === userId ? { ...member, user_type: { id: userTypeId, type: userTypeId === 1 ? 'adult' : 'child' } } : member
      ));
    } catch (err) {
      console.error("Error changing user type:", err);
    }
  }

  async removeFromFamily (userId: number) {
    try {
      const response = await this.usersService.removeFromFamily(userId);

      this.family.update((members) => 
        members.filter((member) => member.id !== userId));
    } catch (err) {
      console.error("Failed to remove member from family:", err);
    }
  }
}
