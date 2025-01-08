import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = '/api/auth';
  private readonly emailUrl = '/api/emails';

  public isAuthenticatedSubject!: BehaviorSubject<boolean>; // Declare without immediate initialization
  isAuthenticated$!: Observable<boolean>;

  constructor(private http: HttpClient, private tokenService: TokenService) {
    // Initialize the BehaviorSubject with the token validity
    const isAuthenticated = this.isTokenValid();
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(isAuthenticated);
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password });
  }

  logout(): void {
    this.tokenService.removeToken();
    console.log('Token removed, updating isAuthenticatedSubject...');
    this.isAuthenticatedSubject.next(false); // Notify subscribers of logout
  }

  isAuthenticated(): boolean {
    return this.isTokenValid(); // Simply check the token validity
  }

  private isTokenValid(): boolean {
    return !this.tokenService.isTokenExpired();
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post(`${this.emailUrl}/reset-password`, { email });
  }

  confirmResetPassword(email: string, token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.emailUrl}/confirm-reset-password`, { email, token, newPassword });
  }
}
