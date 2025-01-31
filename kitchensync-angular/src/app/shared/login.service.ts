import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  private url = "http://127.0.0.1:8000/api";

  constructor() { }

  /**
   * Lets a user verify that they have the right credentials
   * @param email email of user that wants to log in
   * @param password password of user that wants to log in
   * @returns returns a token for later verification and some info on user
   */
  async login(email: string, password: string) {
    try {
      const response = await fetch(`${this.url}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      // Check if the response is OK
      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error('There was a problem with the login fetch operation:', error);
    }
  }

  /**
   * Lets a user log out by deleting their token and changing it in the database for security
   * @param token 
   * @returns 
   */
  logout(token: string) {
    return fetch(`${this.url}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "remember_token": token })
    });
  }

  /**
   * For registering a new user and adding them in database
   * @param email email of the new user
   * @param password password of the new user
   * @param first_name first name of the new user
   * @param last_name last name of the new user
   * @returns returns a token for later verification
   */
  register(email: string, password: string, first_name: string, last_name: string) {
    return fetch(`${this.url}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, first_name, last_name})
    });
  }

  /**
   * Checks if a user has the right token
   * @param token current token in localStorage
   * @returns whether token is valid and a lot of info on the user to store in sessionStorage (id, first_name, last_name, email, user_type_id, family_id)
   */
  verify(token: string) {
    return fetch(`${this.url}/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "remember_token": token })
    });
  }
}
