import { CanActivateFn, Router} from  '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from './shared/login.service';

// the auth guard needs to return a true boolean if the route can be activated
export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService);

  // Check if we have a token in localStorage
  const token = localStorage.getItem('token');
  
  if (token) {
    try {
      // Verify the token
      const response = await loginService.verify(token);
      const data = await response.json();
      
      // If the token is valid, allow access to the route
      if (data.valid) {
        console.log(data);
        sessionStorage.setItem('id', data.user.id);
        sessionStorage.setItem('first_name', data.user.first_name);
        sessionStorage.setItem('last_name', data.user.last_name);
        sessionStorage.setItem('email', data.user.email);
        sessionStorage.setItem('user_type_id', data.user.user_type_id);
        sessionStorage.setItem('family_id', data.user.family_id);
        return true;
      }
      alert("Token expired or incorrect. Please log in again")
      router.navigate(['/login']);
      return false;
    } catch (error) {
      console.error('Token verification failed', error);
    };
  }

  
  // Store the attempted URL for redirecting
  localStorage.setItem('redirectUrl', state.url);
  
  // If no token, redirect to login page
  router.navigate(['/login']);
  return false;
};

