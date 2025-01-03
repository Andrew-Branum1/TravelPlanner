import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = '/api/auth'; // Backend endpoint

  constructor(private http: HttpClient) { }

  // Login method
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  // Logout method
  logout(): void {
    localStorage.removeItem('token'); // Clear the token
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password });
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const expiry = JSON.parse(atob(token.split('.')[1])).exp * 1000; // Convert to milliseconds
    return Date.now() > expiry;
  }


  // Store the token
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Retrieve the token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Optional: Check if the token is expired
    const expiry = this.getTokenExpiry(token);
    return expiry > Date.now();
  }

  // Decode token to get expiry
  private getTokenExpiry(token: string): number {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // Convert to milliseconds
  }
}
