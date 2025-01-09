import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.css']
})
export class EmailConfirmationComponent implements OnInit {
  message = '';
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const email = this.route.snapshot.queryParamMap.get('email');

    if (token && email) {
      this.authService.confirmEmail(email, token).subscribe({
        next: () => {
          this.message = 'Email verified successfully! You can now log in.';
          this.isLoading = false;
        },
        error: (err) => {
          this.message = err.error?.message || 'Email verification failed. Please try again.';
          this.isLoading = false;
        }
      });
    } else {
      this.message = 'Invalid verification link.';
      this.isLoading = false;
    }
  }
}
