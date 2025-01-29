import { Component } from '@angular/core';
import { LoginService } from '../shared/login.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  providers: [LoginService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  emailLogin!: string;
  passwordLogin!: string;
  firstNameSignup!: string;
  lastNameSignup!: string;
  emailSignup!: string;
  passwordSignup!: string;
  passwordSignupVerify!: string;

  showPassword: { [key: string]: boolean } = {
    passwordLogin: false, 
    passwordSignup: false, 
    passwordSignupVerify: false};
  showSignup: boolean = true;
  loginMessage: string = '';
  signupMessage: string = '';

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  /**
   * Handles the login process.
   */
  async login() {
    try {
      // Call the login service
      const data = await this.loginService.login(this.emailLogin, this.passwordLogin);

      // Check if the login was successful
      if (data) {
        // Add a token to the localStorage so you can stay logged in
        localStorage.setItem('token', data.remember_token);
  
        //Get the redirect URL from localStorage go default to home
        const redirectUrl = localStorage.getItem('redirectUrl') || '/home';
        localStorage.removeItem('redirectUrl'); // Clean up
  
        // Navigate to the protected route or home
        this.router.navigate([redirectUrl]);
  
        this.loginMessage = 'Login successful! Redirecting...';
      } else {
        this.loginMessage = 'Invalid username or password.';
      }
    } catch (error) {
      this.loginMessage = 'An error occurred during login. Please try again.';
    }
  }

  /**
   * Make a new user
   * @returns if there is an error in the input to stop the function
   */
  signup() {

    // Error messages
    if (!this.firstNameSignup) {
      this.signupMessage = 'Invalid first name.';
      return
    }
    if (!this.lastNameSignup) {
      this.signupMessage = 'Invalid last name.';
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.emailSignup)) {
      this.signupMessage = 'Invalid email.';
      return
    }

    if (!this.passwordSignup || this.passwordSignup.length < 8) {
      this.signupMessage = 'Password is too short.';
      return
    }

    if (this.passwordSignup === this.passwordSignupVerify) {
      try {
        // Add user to database
        this.loginService.register(this.emailSignup, this.passwordSignup, this.firstNameSignup, this.lastNameSignup);
        this.signupMessage = 'Registered successfully!'
      } catch (error) {
        this.signupMessage = 'An error occurred when trying to register. please try again.'
      }
    } else {
      this.signupMessage = 'Passwords are not identical.';
    }
  }

  /**
   * Logs the user out
   */
  logout() {
    // Use the logout service to change the token in the database. This requires having the right token
    this.loginService.logout(localStorage.getItem('token') || '');

    // Remove the token from localStorage
    localStorage.removeItem('token');

    this.router.navigate(['/login']);
  }

  /**
   * Changes whether a string is visible or shown as ****
   * @param input the string that needs to change from visible to hidden or vice versa
   */
  togglePassword(input: string): void {
    this.showPassword[input] = !this.showPassword[input];
  }

  /**
   * Toggle between login and signup
   */
  toggleForms(): void {
    this.showSignup = !this.showSignup

  }
}
