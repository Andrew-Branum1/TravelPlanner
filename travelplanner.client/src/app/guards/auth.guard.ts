import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check for public routes
  if (route.data?.['public']) {
    console.log(`Public route accessed: ${state.url}`);
    return true; // Allow access to public routes
  }

  // Return an observable that resolves true/false based on authentication
  console.log(`Protected route accessed: ${state.url}`);
  return authService.isAuthenticated().pipe(
    map((isAuthenticated) => {
      console.log(`Authentication status: ${isAuthenticated}`);
      if (isAuthenticated) {
        return true; // Allow access
      } else {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false; // Deny access
      }
    }),
    catchError(() => {
      // Handle error by redirecting to login
      console.log(`Error occurred while checking authentication.`);
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return [false]; // Deny access
    })
  );
};
