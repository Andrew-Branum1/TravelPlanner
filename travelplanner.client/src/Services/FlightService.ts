import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Flight } from '../Models/Flight';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private baseUrl = `${environment.apiUrl}/flights`;

  constructor(private http: HttpClient) { }

  getFlights(page: number, pageSize: number, filters: { airline?: string; origin?: string; destination?: string; maxPrice?: number }): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filters.airline) params = params.set('airline', filters.airline);
    if (filters.origin) params = params.set('origin', filters.origin);
    if (filters.destination) params = params.set('destination', filters.destination);
    if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());

    return this.http.get<any>(`${this.baseUrl}`, { params });
  }

}
