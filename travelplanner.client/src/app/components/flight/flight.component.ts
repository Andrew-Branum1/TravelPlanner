import { Component, OnInit } from '@angular/core';
import { Flight } from '../../../Models/Flight';
import { FlightService } from '../../../Services/FlightService';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css']
})
export class FlightComponent implements OnInit {
  flights: Flight[] = [];
  totalItems = 0;
  currentPage = 1;
  pageSize = 5;
  filters = {
    airline: '',
    origin: '',
    destination: '',
    maxPrice: undefined
  };
  sort = {
    sortBy: 'departureTime',
    sortDirection: 'asc'
  };

  constructor(private flightService: FlightService) { }

  ngOnInit() {
    this.fetchFlights();
  }

  fetchFlights() {
    this.flightService
      .getFlights(this.filters, this.sort, { page: this.currentPage, pageSize: this.pageSize })
      .subscribe((response) => {
        console.log('API Response:', response); // Debugging
        this.flights = response.flights;
        this.totalItems = response.totalItems;
      },
        (error) => console.error('Error fetching flights:', error)
      );
  }

  applyFilters() {
    this.currentPage = 1; // Reset to the first page
    this.fetchFlights();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchFlights();
  }

  changeSorting(sortBy: string) {
    this.sort.sortBy = sortBy;
    this.sort.sortDirection = this.sort.sortDirection === 'asc' ? 'desc' : 'asc';
    this.fetchFlights();
  }
}
