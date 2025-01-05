import { Component } from '@angular/core';
import { EmailService } from '../../services/email.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  email = '';
  message = '';
  isLoading = false;

  constructor(
    private emailService: EmailService,
    private notificationService: NotificationService
  ) { }

  onSubmit(): void {
    this.isLoading = true;
    this.emailService.resetPassword(this.email).subscribe({
      next: () => {
        this.message = 'A reset link has been sent to your email.';
        this.isLoading = false;
      },
      error: (err) => {
        this.notificationService.showError(err.error?.message || 'Failed to send reset link.');
        this.isLoading = false;
      }
    });
  }
}
