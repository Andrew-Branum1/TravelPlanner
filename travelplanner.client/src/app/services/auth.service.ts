import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = '/api/auth';
  private readonly emailUrl = '/api/emails';

  private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();


  constructor(private http: HttpClient) {
    //this.checkAuthentication(); // Check auth state on service initialization
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password }, { withCredentials: true }).pipe(
      tap(() => this.isAuthenticatedSubject.next(true)) // Update local auth state
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => this.isAuthenticatedSubject.next(false))
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password });
  }

  isAuthenticated(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/authenticated`, { withCredentials: true }).pipe(
      tap((isAuthenticated) => this.isAuthenticatedSubject.next(isAuthenticated))
    );
  }

  private checkAuthentication(): void {
    console.log('checkAuthentication triggered');
    this.isAuthenticated().subscribe({
      error: (err) => {
        console.error('Failed to check authentication:', err);
        this.isAuthenticatedSubject.next(false);
      },
    });
  }

  confirmEmail(email: string, token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirm-email`, { email, token });
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post(`${this.emailUrl}/reset-password`, { email });
  }

  confirmResetPassword(email: string, token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.emailUrl}/confirm-reset-password`, { email, token, newPassword });
  }

  resendVerificationEmail(email: string): Observable<any> {
    return this.http.post(`${this.emailUrl}/resend-verification-email`, { email });
  }

}
