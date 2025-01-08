import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public forecasts: WeatherForecast[] = [];
  public users: any[] = []; // Example for additional endpoint

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const isAuthenticated = this.authService.isAuthenticated();
        this.authService.isAuthenticatedSubject.next(isAuthenticated);
      }
    });
  }

  title = 'travelplanner.client';
}
