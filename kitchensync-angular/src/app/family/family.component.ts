import { Component, signal } from '@angular/core';
import { FamiliesService } from '../shared/families.service';
import { UsersService } from '../shared/users.service';
import { FormsModule } from '@angular/forms';
import { InvitationComponent } from "../invitation/invitation.component";
import { InvitationsService } from '../shared/invitations.service';
import { parseMarker } from '@fullcalendar/core/internal';

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

  /** 
  * Function to get all the members of a family with all info on them
  */
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

  /**
   * Create a new family with any name. Assign user to this family
   * @param familyName 
   */
  async createFamily(familyName: string) {
    // Add new family to database
    const response = await this.familiesService.addFamily(familyName);

    // get the id of the new family
    this.familyId = Number(response.family_id);

    // Assign family_id to the user who made the family
    this.usersService.assignFamily(this.familyId)
  }

  /**
   * Send an invite to the user with the email emailInvite
   * @param emailInvite 
   */
  async invite(emailInvite: string) {
    // Reset inviteMessage
    this.inviteMessage = '';

    // Call the invite function. This will add an invitation and return a message
    const response = await this.invitationsService.invite(emailInvite, String(this.userId), String(this.familyId));

    // Display the message
    this.inviteMessage = await response.message;
  }

  /**
   * Change the user type of someone
   * @param userId the id of the person whose user_type_id you're trying to change
   * @param userTypeId number you're trying to change the user_type_id to
   */
  async changeUserType(userId: number, userTypeId: number) {
    try {
      // Assign a new user_type to a user
      await this.usersService.assignType(userId, userTypeId);
      
      // Change what is shown on the page with a signal. It only changes the member of the family with the same user_id
      this.family.update((members) =>
        members.map((member) =>
          member.id === userId ? { ...member, user_type: { id: userTypeId, type: userTypeId === 1 ? 'adult' : 'child' } } : member
      ));
    } catch (err) {
      console.error("Error changing user type:", err);
    }
  }

  /**
   * Remove someone else from your family
   * @param userId id of the person you're trying to remove
   * @param name name of the user that's being removed
   */
  async removeFromFamily (userId: number, name: string) {
    try {

      // Make sure the user should be removed
      let confirmed = confirm("Are you sure you want to remove\"" + name + "\" from your family?" );

      if (confirmed) {
        // Remove user from family
        await this.usersService.removeFromFamily(userId);

        // Don't show user in family anymore. Signal filters out the user whit this user_id
        this.family.update((members) => 
          members.filter((member) => member.id !== userId));
      }
    } catch (err) {
      console.error("Failed to remove member from family:", err);
    }
  }
}
