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

  async getInvitations() {
    try {
      const response = await this.invitationsService.getUserInvitations(this.userId);

      if (response) {
        const pending = response.filter((invitation: { status_id: number}) => invitation.status_id === 1);
        this.invitations.set(pending);
      }
    } catch (error) {
      console.error('There was a problem with getting user invitations:', error);
    }
    return [];
  }

  async handleRefuse(invitationId: number) {
    try {
      await this.invitationsService.delete(invitationId);
      this.invitations.update((invitations) => 
        invitations.filter((invitation) => invitation.id !== invitationId));
    } catch (error) {
      console.error('There was a problem declining the invitation:', error);
    }
  }

  async handleAccept(invitationId: number) {
    try {
      await this.invitationsService.updateStatus(invitationId, 'accepted');
      this.invitations.update((invitations) => 
        invitations.filter((invitation) => invitation.id !== invitationId));
      await this.familyComponent.getFamily() 
    } catch (error) {
      console.error('There was a problem accepting the invitation:', error);
    }
  }
}
