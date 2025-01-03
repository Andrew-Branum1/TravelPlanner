import { ErrorHandler, Injectable } from '@angular/core';
import { NotificationService } from './notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private notificationService: NotificationService) { }

  handleError(error: any): void {
    console.error('An error occurred:', error);

    // Display a friendly error message
    this.notificationService.showError('An unexpected error occurred.');

    // Optionally log the error to a server
  }
}
