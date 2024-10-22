import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-wearhouse-inventory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    NgxPaginationModule,
  ],
  templateUrl: './wearhouse-inventory.component.html',
  styleUrl: './wearhouse-inventory.component.css'
})
export class WearhouseInventoryComponent {
  TaulaParchi: any[] = [];
  TaulaParchiCount = 0;
  TruckLoadingParchi: any[] = [];
  TruckLoadingParchiCount = 0;
  currentPage = 1; 
  perPage = 5; 
  totalItems = 0;
  fromDate: any;
  toDate: any;
  Storage: any[] = [];
  TaulParchiWeightSummary: any[] = [];
  TruckLoadingParchiWeightSummary: any[] = [];
  selectedLocation:any
  tabState: 'truckloading' | 'taulparchi' = 'taulparchi';
  
  constructor(private apiService: ApiService) {} 

  ngOnInit(): void {
    this.setTabState('taulparchi');
    this.fetchStorage()

  }
  setTabState(newtabstate: 'truckloading' | 'taulparchi') {
    this.tabState = newtabstate;
    this.currentPage = 1;
    if (this.tabState == 'truckloading') {
      this.getTruckLoadingParchis();
      this.getTaulParchisWeightSummary()
    } else if (this.tabState == 'taulparchi') {
      this.getTaulaParchis();
      this.getTruckLoadingParchisWeightSummary()
    }
  }
  getTaulaParchis() {
    let params:any={
      page: this.currentPage,
      limit: this.perPage,
      // crop:this.selectedCrop
    };
    if(this.selectedLocation){
      params.storage=this.selectedLocation
    }
    this.apiService
      .get('taulparchi', {
        params
      })
      .subscribe({
        next: (res: any) => {
          this.TaulaParchi = res.data;
          this.TaulaParchiCount = res.meta.total || this.TaulaParchi.length;
        },
        error: (err: any) => {
          console.error('Error fetching TaulaParchis:', err);
        },
      });
  }
  getTruckLoadingParchis() {
    let params:any={
      page: this.currentPage,
      limit: this.perPage,
      // crop:this.selectedCrop
    };
    if(this.selectedLocation){
      params.storage=this.selectedLocation
    }
    this.apiService
      .get('truckloading', {
        params
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
  fetchStorage() {
    this.apiService.get('storage',{
      params: {
        page: 1,
        limit: 1000
      },
    }).subscribe({
      next: (res: any) => {
        this.Storage = res.data;
      },
      error: (err: any) => {
        console.error('Error fetching Storage:', err);
      }
    });
  }
  getTruckLoadingParchisWeightSummary() {
    let params:any ={}
    if(this.selectedLocation){
      params.storage=this.selectedLocation
    }
    if(this.fromDate){
      params.fromDate=this.fromDate
    }
    if(this.toDate){
      params.toDate=this.toDate
    }
    this.apiService
      .get('truckloading/getWeightwearhouseSummary', {
        params
      })
      .subscribe({
        next: (res: any) => {
          this.TruckLoadingParchiWeightSummary = res.data;
        },
        error: (err: any) => {
          console.error('Error fetching TruckLoadingParchis:', err);
        },
      });
  }
  getTaulParchisWeightSummary() {
    let params:any ={}
    if(this.selectedLocation){
      params.storage=this.selectedLocation
    }
    if(this.fromDate){
      params.fromDate=this.fromDate
    }
    if(this.toDate){
      params.toDate=this.toDate
    }
    this.apiService
      .get('taulparchi/getWeightwearhouseSummary', {
        params
      })
      .subscribe({
        next: (res: any) => {
          this.TaulParchiWeightSummary = res.data;
          console.log("dataaa",res.data)
        },
        error: (err: any) => {
          console.error('Error fetching TaulParchis:', err);
        },
      });
  }
}
