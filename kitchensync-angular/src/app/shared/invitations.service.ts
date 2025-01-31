import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InvitationsService {
  private url = "http://127.0.0.1:8000/api";

  constructor() { }

  /**
   * Invite someone to a family
   * @param email email of the person you're inviting
   * @param inviterId id of the person who's trying to invite soemone
   * @param familyId id of the family you're inviting someone to
   * @returns whether it was successful and a message
   */
  async invite(email: string, inviterId: string, familyId: string) {
    try {
      const response = await fetch(`${this.url}/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, "inviter_id": inviterId, "family_id": familyId})
      });

      const data = await response.json();
      console.log(data);
      // Check if the response is OK
      if (!response.ok) {
        // Handle different error cases
        if (data.error_code === 'USER_NOT_FOUND') {
          return { success: false, message: "User not found." };
        } else if (data.error_code === 'INVALID_EMAIL_FORMAT') {
          return { success: false, message: "Your input is not an email." };
        } else if (data.error_code === 'USER_ALREADY_INVITED') {
          return { success: false, message: "User already invited." };
        } else if (data.error_code === 'USER_ALREADY_IN_FAMILY') {
          return { success: false, message: "User already in family." };
        } else {
          return { success: false, message: "An unexpected error occurred. Try again later." };
        }
      }

      return data;
    } catch (error) {
      console.error('There was a problem with inviting this user:', error);
    }
  }

  /**
   * get all the invitations for a user
   * @param userId id of the user who's being invited
   * @returns all the invitations with information on the inviter, family and status of the invitation
   */
  async getUserInvitations(userId: number) {
    try {
      const response = await fetch(`${this.url}/invitations/${userId}`);

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('There was a problem with getting user invitations:', error);
    }

  }

  /**
   * Change the status of an invitation to accepted
   * @param invitationId the id of the invitation that is updated
   * @param status the status you want to change it to, now it's accepted by default
   * @returns can return a error message or a success message
   */
  async updateStatus(invitationId: number, status: 'accepted') {
    try {
      const response = await fetch(`${this.url}/invitations/${invitationId}`, {
        method: 'PATCH',
        headers: {  
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      // Check if the response is OK
      if (!response.ok) {
        throw new Error("Couldn't update invitation status");
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error('There was a problem with updating invitation status:', error);
    }
  }

  /**
   * Delete an invitation
   * @param invitationId invitation that will be deleted
   */
  async delete(invitationId: number) {
    try {
        await fetch(`${this.url}/invitations/${invitationId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('There was a problem deleting the invitation:', error);
    }
  } 

}
