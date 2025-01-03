import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Check if the user is authenticated and the token is not expired
  if (authService.isAuthenticated() && !tokenService.isTokenExpired()) {
    return true; // Allow access
  }

  // Redirect to login if not authenticated or token expired
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
