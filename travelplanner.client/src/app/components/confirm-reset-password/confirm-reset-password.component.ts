import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-confirm-reset-password',
  templateUrl: './confirm-reset-password.component.html',
  styleUrl: './confirm-reset-password.component.css'
})
export class ConfirmResetPasswordComponent {
  email = '';
  token = '';
  newPassword = '';
  confirmPassword = '';
  message = '';
  isLoading = false;
  passwordStrength = 0;
  strengthText = '';
  strengthColor: 'primary' | 'warn' | 'accent' = 'primary';

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {
    this.email = this.route.snapshot.queryParams['email'];
    this.token = this.route.snapshot.queryParams['token'];
  }

  get passwordsMatch(): boolean {
    return this.newPassword === this.confirmPassword;
  }

  checkPasswordStrength(): void {
    const strength = this.calculateStrength(this.newPassword);
    this.passwordStrength = strength.value;
    this.strengthText = strength.text;
    this.strengthColor = strength.color;
  }

  calculateStrength(password: string): { value: number; text: string; color: 'primary' | 'warn' | 'accent' } {
    let score = 0;
    if (!password) {
      return { value: 0, text: '', color: 'primary' };
    }

    // Password length
    if (password.length >= 8) score += 25;

    // Contains lowercase, uppercase, numbers, and special characters
    if (/[a-z]/.test(password)) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 20;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;

    // Assign text and color based on score
    if (score <= 25) {
      return { value: score, text: 'Weak', color: 'warn' };
    } else if (score <= 60) {
      return { value: score, text: 'Medium', color: 'accent' };
    } else {
      return { value: score, text: 'Strong', color: 'primary' };
    }
  }

  onSubmit(): void {
    if (!this.passwordsMatch) {
      this.message = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;
    this.authService.confirmResetPassword(this.email, this.token, this.newPassword).subscribe({
      next: () => {
        this.message = 'Password reset successfully.';
        this.isLoading = false;

        // Redirect to login page after a short delay
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.message = err.error?.message || 'Failed to reset password.';
        this.isLoading = false;
      },
    });
  }
}
