import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Flight } from '../../../Models/Flight';
import { FlightService } from '../../../Services/FlightService';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css']
})
export class FlightComponent implements OnInit {
  displayedColumns: string[] = ['airline', 'origin', 'destination', 'departureTime', 'arrivalTime', 'price'];
  dataSource = new MatTableDataSource<Flight>([]);
  totalItems = 0;
  pageSize = 25;

  currentPage = 1;
  filters = {
    airline: '',
    origin: '',
    destination: '',
    maxPrice: undefined
  };


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private flightService: FlightService) { }

  ngOnInit() {
    this.fetchFlights();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilters() {
    this.currentPage = 0; // Reset to the first page
    this.fetchFlights();
  }

  fetchFlights() {
    const { airline, origin, destination } = this.filters;
    this.flightService.getFlights(this.currentPage, this.pageSize, { airline, origin, destination }).subscribe(
      (response) => {
        console.log('Backend Response:', response); // Debugging
        this.dataSource.data = response.flights;
        // Force table refresh
        this.dataSource._updateChangeSubscription();
        this.totalItems = response.totalItems;

        console.log('Total Items:', this.totalItems);

        // Update paginator properties
        if (this.paginator) {
          this.paginator.pageSize = this.pageSize;
          this.paginator.pageIndex = this.currentPage - 1; // Angular paginator uses 0-based index
          this.paginator.length = this.totalItems; // Total items in the dataset

          console.log('Paginator State:', {
            length: this.paginator.length,
            pageSize: this.paginator.pageSize,
            pageIndex: this.paginator.pageIndex,
          });
        }
      },
      (error) => console.error('Error fetching flights:', error)
    );
  }


  onPageChange(event: any) {
    console.log('Page Size:', event.pageSize);
    console.log('Page Index:', event.pageIndex);
    console.log('Current Page (to Backend):', event.pageIndex + 1);
    console.log('totalItems: ', this.totalItems);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.fetchFlights();
  }
}
