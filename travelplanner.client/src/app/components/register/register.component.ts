import { Component, Injectable } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective } from '@angular/forms';

@Injectable()
export class CustomErrorStateMatcher implements ErrorStateMatcher {
  constructor(private component: RegisterComponent) { }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      (control.invalid || this.component.passwordMismatch) &&
      (control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [
    { provide: ErrorStateMatcher, useClass: CustomErrorStateMatcher }
  ]
})

export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  isLoading = false;
  hidePassword = true;
  passwordMismatch = false;
  customErrorStateMatcher: ErrorStateMatcher;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) { this.customErrorStateMatcher = new CustomErrorStateMatcher(this); }

  onSubmit(): void {
    this.passwordMismatch = this.password !== this.confirmPassword;
    if (this.passwordMismatch) {
      return;
    }

    this.register();
  }

  checkPasswordMismatch(): void {
    this.passwordMismatch = this.password !== this.confirmPassword;
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
