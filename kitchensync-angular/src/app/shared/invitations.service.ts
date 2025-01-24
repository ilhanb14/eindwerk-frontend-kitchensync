import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InvitationsService {
  private url = "http://127.0.0.1:8000/api";

  constructor() { }

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

  async updateStatus(invitationId: number, status: 'accepted' | 'declined') {
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

}
