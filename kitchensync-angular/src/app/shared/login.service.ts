import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  private url = "http://127.0.0.1:8000/api";

  constructor() { }

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

  logout(token: string) {
    return fetch(`${this.url}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "remember_token": token })
    });
  }

  register(email: string, password: string, first_name: string, last_name: string, family_id: number, user_type_id: number) {
    return fetch(`${this.url}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, first_name, last_name, family_id, user_type_id })
    });
  }

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
