import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  isLoading = false;
  hidePassword = true;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.password !== this.confirmPassword) {
      this.notificationService.showError('Passwords do not match.');
      return;
    }
    this.register();
  }

  register(): void {
    this.isLoading = true;
    this.authService.register(this.username, this.email, this.password).subscribe({
      next: () => {
        this.notificationService.showSuccess('Registration successful!');
        this.router.navigate(['/login']);
        this.isLoading = false;
      },
      error: (err) => {
        this.notificationService.showError(err.error?.message || 'Registration failed.');
        this.isLoading = false;
      }
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
