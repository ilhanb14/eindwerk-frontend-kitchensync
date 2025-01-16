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
        return true;
      }
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
