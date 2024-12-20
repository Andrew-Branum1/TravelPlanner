import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';

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

  constructor(private http: HttpClient) { }

  ngOnInit() {
    //this.getWeatherForecasts();
    //this.getUsers(); // Example for multiple API requests
  }

  getWeatherForecasts() {
    this.http.get<WeatherForecast[]>(`${environment.apiUrl}/weatherforecast`).subscribe(
      (result) => {
        this.forecasts = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getUsers() {
    this.http.get<any[]>(`${environment.apiUrl}/users`).subscribe(
      (result) => {
        this.users = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  title = 'travelplanner.client';
}
