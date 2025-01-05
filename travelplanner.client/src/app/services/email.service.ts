import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private readonly emailUrl = '/api/emails';

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  resetPassword(email: string): Observable<any> {
    return this.http.post(`${this.emailUrl}/send-reset-password`, { email });
  }

  confirmResetPassword(email: string, token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.emailUrl}/confirm-reset-password`, { email, token, newPassword });
  }


}
