import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  currentDate = new Date();
  TaulaParchiCount = 0;
  TruckLoadingParchiCount = 0;
  TaulaParchi: any[] = [];
  TruckLoadingParchi: any[] = [];
  Crops: any;
  Datas: any;
  TaulaParchiDetails: any
  TaulaParchiDetailsCount = 0;
  TruckLoadingDetails: any;
  TruckLoadingDetailsCount = 0
  remainingCrops: any[] = [];
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getTaulaParchis();
    this.getTaulaParchiDetails()
    this.getTruckLoadingParchis();
    this.getTaulparchisAggregatedCropData()
    this.getTruckLoadingDetails()
    this.getTruckLoadingAggregatedCropData()
    
  }
  
  // Fetch TaulaParchis from backend
  getTaulaParchis() {
    this.apiService
      .get('taulparchi', {
        params: {
          page: 1,
          limit: 1000, 
        },
      })
      .subscribe({
        next: (res: any) => {
          this.TaulaParchi = res.data;
          this.TaulaParchiCount = res.total || this.TaulaParchi.length;
        },
        error: (err: any) => {
          console.error('Error fetching TaulaParchis:', err);
        },
      });
  }

  getTaulaParchiDetails() {
    this.apiService.get('taulparchi/getdetails', {
      params: { page: 1, limit: 1000 }
    })
    .subscribe({
      next: (res: any) => {
        if (res && Array.isArray(res)) {
          console.log("res", res);
          // Assuming you want the first item
          this.TaulaParchiDetails = res[0]; // Get the first object
          this.TaulaParchiDetailsCount = res.length; // Total number of items
          console.log('Taula Parchi Details:', this.TaulaParchiDetails);
        } else {
          console.error('Invalid response format for Taula Parchi details:', res);
        }
      },
      error: (err: any) => {
        console.error('Error fetching Taula Parchi details:', err.message || err);
      }
    });
    
  }
  


  getTaulparchisAggregatedCropData() {
    this.apiService
      .get('taulparchi/taulparchisAggregate', {
        params: {
          page: 1,
          limit: 1000, 
        },
      })
      .subscribe({
        next: (res: any) => {
        // if(res){
          if (Array.isArray(res)) {
            this.Crops = res; 
            console.log('Aggregated Taul Parchis Data:', this.Crops);
          } else {
            console.error('Invalid response format:', res);
          }
        },
        error: (err: any) => {
          console.error('Error fetching Taul Parchis Aggregated Data:', err.message || err);
        },
      });
  }
  
  // Fetch TruckLoadingParchis from backend
  getTruckLoadingParchis() {
    this.apiService
      .get('truckloading', {
        params: {
          page: 1,
          limit: 1000, 
        },
      })
      .subscribe({
        next: (res: any) => {
          this.TruckLoadingParchi = res.data;
          console.log('loading...', res.data);
          this.TruckLoadingParchiCount =
            res.total || this.TruckLoadingParchi.length;
        },
        error: (err: any) => {
          console.error('Error fetching TruckLoadingParchis:', err);
        },
      });
  }

  getTruckLoadingDetails() {
    this.apiService
      .get('truckloading/getdetails', {
        params: {
          page: 1,
          limit: 1000,
        },
      })
      .subscribe({
        next: (res: any) => {
          if (res && Array.isArray(res)) {
            console.log("Response:", res);
            this.TruckLoadingDetails = res[0]; // Assuming you want to get the first item
            this.TruckLoadingDetailsCount = res.length; // Total number of items
            console.log("Truck loading details:", this.TruckLoadingDetails);
          } else {
            console.error('Invalid response format:', res);
          }
        },
        error: (err: any) => {
          console.error('Error fetching truck loading details:', err.message || err);
        },
      });
  }
  
  getTruckLoadingAggregatedCropData() {
    this.apiService
      .get('truckloading/truck-loading-details', {
        params: {
          page: 1,
          limit: 1000,
        },
      })
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.Datas = res; 
            console.log('Aggregated Truck Loading Data:', this.Datas);
          } else {
            console.error('Invalid response format:', res);
          }
        },
        error: (err: any) => {
          console.error('Error fetching Truck Loading Aggregated Data:', err.message || err);
        },
      });
  }
  
}
