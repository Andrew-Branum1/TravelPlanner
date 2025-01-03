import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from './notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.notificationService.showError('Unauthorized access. Please log in.');
        } else if (error.status === 403) {
          this.notificationService.showError('Access denied.');
        } else if (error.status >= 500) {
          this.notificationService.showError('A server error occurred.');
        } else {
          this.notificationService.showError(error.error?.message || 'An unexpected error occurred.');
        }
        return throwError(() => error);
      })
    );
  }
}
