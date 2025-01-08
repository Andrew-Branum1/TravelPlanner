import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((status) => {
      console.log('Authentication status updated:', status);
      this.isLoggedIn = status;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
