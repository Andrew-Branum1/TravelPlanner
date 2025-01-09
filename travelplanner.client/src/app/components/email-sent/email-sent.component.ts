import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-email-sent',
  templateUrl: './email-sent.component.html',
  styleUrl: './email-sent.component.css'
})
export class EmailSentComponent {
  email: string;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    // Retrieve the email from query params or local storage
    this.email = this.route.snapshot.queryParamMap.get('email') || localStorage.getItem('email') || '';
  }

  resendEmail(): void {
    if (!this.email) {
      alert('Email not found. Please try registering again.');
      return;
    }

    this.authService.resendVerificationEmail(this.email).subscribe({
      next: () => alert('Verification email resent successfully.'),
      error: (err) => alert('Failed to resend email. Please try again.')
    });
  }
}
