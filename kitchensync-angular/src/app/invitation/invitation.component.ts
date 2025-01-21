import { Component } from '@angular/core';
import { InvitationsService } from '../shared/invitations.service';

@Component({
  selector: 'app-invitation',
  imports: [],
  templateUrl: './invitation.component.html',
  styleUrl: './invitation.component.css'
})
export class InvitationComponent {
  userId: number = Number(sessionStorage.getItem('id'));
  invitations: any[] = [];

  constructor(
    private invitationsService: InvitationsService
  ) { 

    this.getInvitations();
  }

  async getInvitations() {
    try {
      const response = await this.invitationsService.getUserInvitations(this.userId);
      if (response) {
        this.invitations = response;
        return this.invitations;
      }
    } catch (error) {
      console.error('There was a problem with getting user invitations:', error);
    }
    return [];
  }

  async handleRefuse(invitationId: number) {
    try {
      await this.invitationsService.updateStatus(invitationId, 'declined');
      await this.getInvitations();
    } catch (error) {
      console.error('There was a problem declining the invitation:', error);
    }
  }

  async handleAccept(invitationId: number) {
    try {
      await this.invitationsService.updateStatus(invitationId, 'accepted');
      this.getInvitations();
    } catch (error) {
      console.error('There was a problem accepting the invitation:', error);
    }
  }
}
