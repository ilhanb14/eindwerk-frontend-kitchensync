import { Component, signal } from '@angular/core';
import { InvitationsService } from '../shared/invitations.service';
import { FamilyComponent } from '../family/family.component';

@Component({
  selector: 'app-invitation',
  imports: [],
  templateUrl: './invitation.component.html',
  styleUrl: './invitation.component.css'
})
export class InvitationComponent {
  userId: number = Number(sessionStorage.getItem('id'));
  invitations = signal<any[]>([]);

  constructor(
    private invitationsService: InvitationsService,
    private familyComponent: FamilyComponent,
  ) { 

    this.getInvitations();
  }

  /**
   * Get all the invitations for the current user 
   */
  async getInvitations() {
    try {
      // Get the invitations from database
      const response = await this.invitationsService.getUserInvitations(this.userId);

      if (response) {
        // Only show the invitations where the user hasn't responded to yet
        const pending = response.filter((invitation: { status_id: number}) => invitation.status_id === 1);
        this.invitations.set(pending);
      }
    } catch (error) {
      console.error('There was a problem with getting user invitations:', error);
    }
  }

  /**
   * Refuse the invitation and remove it from screen and database
   * @param invitationId 
   */
  async handleRefuse(invitationId: number) {
    try {
      // Make sure the user wants to remove the invitation
      let confirmed = confirm("Are you sure you want to refuse this invitation?");

      if (confirmed) {
        // Delete the invitation from the database
        await this.invitationsService.delete(invitationId);

        // Update the invitations so the refused invitation isn't shown anymore
        this.invitations.update((invitations) => 
          invitations.filter((invitation) => invitation.id !== invitationId));
      }
    } catch (error) {
      console.error('There was a problem declining the invitation:', error);
    }
  }

  /**
   * Accept the invitation, change family_id on user, change status of invitation to accepted, 
   * update family and invitation components on screen
   * @param invitationId 
   */
  async handleAccept(invitationId: number) {
    try {
      // Make sure the user wants to accept the invitation
      let confirmed = confirm("Are you sure you want to accept this invitation?");

      if (confirmed) {
        // Change the status on the invitation to accepted
        await this.invitationsService.updateStatus(invitationId, 'accepted');

        // Remove the invitation from so it isn't shown anymore
        this.invitations.update((invitations) => 
          invitations.filter((invitation) => invitation.id !== invitationId));

        // Load the new family members
        await this.familyComponent.getFamily();
      }
    } catch (error) {
      console.error('There was a problem accepting the invitation:', error);
    }
  }
}
