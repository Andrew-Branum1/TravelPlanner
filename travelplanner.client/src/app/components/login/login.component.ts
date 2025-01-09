import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;
  hidePassword = true;

  constructor(private notificationService: NotificationService, private authService: AuthService, private router: Router, private route: ActivatedRoute) { }


  ngOnInit(): void {
    console.log('LoginComponent initialized');
  }

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.notificationService.showError('Username and password are required.');
      return;
    }

    this.isLoading = true;
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.notificationService.showSuccess('Login successful!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        if (err.error?.message === 'Email not verified.') {
          this.notificationService.showError('Please verify your email before logging in.');
        } else {
          this.notificationService.showError(err.error?.message || 'Login failed.');
        }
      },
      complete: () => (this.isLoading = false),
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
