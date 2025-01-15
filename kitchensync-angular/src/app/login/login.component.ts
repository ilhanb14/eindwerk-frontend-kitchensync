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
  emailInput!: string;
  passwordInput!: string;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  async onSubmit() {
    const data = await this.loginService.login(this.emailInput, this.passwordInput);
    if (data) {
      localStorage.setItem('token', data.remember_token);

      //Get the redirect URL from localStorage or use a default value
      const redirectUrl = localStorage.getItem('redirectUrl') || '/home';
      localStorage.removeItem('redirectUrl'); // Clean up

      // Navigate to the protected route or home
      this.router.navigate([redirectUrl]);
    } else {
      alert('Invalid username or password');
    };
  }

  logout() {
    this.loginService.logout(localStorage.getItem('token') || '');

    localStorage.removeItem('token');

    this.router.navigate(['/login']);
  }
}
