import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Flight } from '../Models/Flight';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private baseUrl = `${environment.apiUrl}/flights`;

  constructor(private http: HttpClient) { }

  getFlights(
    filters: { airline?: string; origin?: string; destination?: string; maxPrice?: number } = {},
    sort: { sortBy?: string; sortDirection?: string } = { sortBy: 'departureTime', sortDirection: 'asc' },
    pagination: { page?: number; pageSize?: number } = { page: 1, pageSize: 5 }
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', pagination.page?.toString() || '1')
      .set('pageSize', pagination.pageSize?.toString() || '5')
      .set('sortBy', sort.sortBy || 'departureTime')
      .set('sortDirection', sort.sortDirection || 'asc');

    if (filters.airline) params = params.set('airline', filters.airline);
    if (filters.origin) params = params.set('origin', filters.origin);
    if (filters.destination) params = params.set('destination', filters.destination);
    if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());

    return this.http.get<any>(this.baseUrl, { params });
  }
}
