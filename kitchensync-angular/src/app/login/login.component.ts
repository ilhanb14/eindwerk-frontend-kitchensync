import { Component } from '@angular/core';
import { LoginService } from '../shared/login.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../shared/login.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  providers: [LoginService],
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

  async login() {
    try {
      const data = await this.loginService.login(this.emailLogin, this.passwordLogin);
      if (data) {
        localStorage.setItem('token', data.remember_token);
  
        //Get the redirect URL from localStorage or use a default value
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

  signup() {
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
        this.loginService.register(this.emailSignup, this.passwordSignup, this.firstNameSignup, this.lastNameSignup);
        this.signupMessage = 'Registered successfully!'
      } catch (error) {
        this.signupMessage = 'An error occurred when trying to register. please try again.'
      }
    } else {
      this.signupMessage = 'Passwords are not identical.';
    }
  }

  logout() {
    this.loginService.logout(localStorage.getItem('token') || '');

    localStorage.removeItem('token');

    this.router.navigate(['/login']);
  }

  togglePassword(input: string): void {
    this.showPassword[input] = !this.showPassword[input];
  }

  toggleForms(): void {
    this.showSignup = !this.showSignup

  }
}
