import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  private authSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    console.log('LayoutComponent initialized');
    this.authSubscription = this.authService.isAuthenticated$.subscribe({
      next: (status) => {
        console.log('Auth state updated:', status);
        this.isLoggedIn = status;
      },
      error: (err) => {
        console.error('Error checking authentication state:', err);
        this.isLoggedIn = false;
      },
    });
  }



  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error during logout:', err);
      },
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from observables to prevent memory leaks
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
