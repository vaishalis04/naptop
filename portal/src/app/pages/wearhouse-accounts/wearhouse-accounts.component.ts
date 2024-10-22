import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

interface Transaction {
  date: Date;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}
@Component({
  selector: 'app-wearhouse-accounts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    NgxPaginationModule,
  ],
  templateUrl: './wearhouse-accounts.component.html',
  styleUrl: './wearhouse-accounts.component.css'
})
export class WearhouseAccountsComponent implements OnInit {
  TaulaParchi: any[] = [];
  TaulaParchiCount = 0;
  TruckLoadingParchi: any[] = [];
  TruckLoadingParchiCount = 0;
  currentPage = 1; // Default page
  perPage = 5; // Items per page
  totalItems = 0;
  fromDate: any;
  toDate: any;
  TruckLoadingParchiTransactionSummary: any[] = [];
  TaulParchiTransactionSummary: any[] = [];
  Storage: any[] = [];
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
      this.getTruckLoadingParchisTransactionSummary();
    } else if (this.tabState == 'taulparchi') {
      this.getTaulaParchis();
      this.getTaulParchisTransactionSummary();
    }
  }
  getTaulaParchis() {
    let params:any={
      page: this.currentPage,
      limit: this.perPage,
      // crop:this.selectedLocation
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
      // crop:this.selectedLocation
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
  getTruckLoadingParchisTransactionSummary() {
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
      .get('truckloading/getWearhousesummary', {
        params
      })
      .subscribe({
        next: (res: any) => {
          this.TruckLoadingParchiTransactionSummary = res.data;
        },
        error: (err: any) => {
          console.error('Error fetching TruckLoadingParchis:', err);
        },
      });
  }
  getTaulParchisTransactionSummary() {
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
      .get('taulparchi/getwearhouseSummary', {
        params
      })
      .subscribe({
        next: (res: any) => {
          this.TaulParchiTransactionSummary = res.data;
        },
        error: (err: any) => {
          console.error('Error fetching TaulParchis:', err);
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

}
