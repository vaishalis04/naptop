import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    NgxPaginationModule,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {
  TaulaParchi: any[] = [];
  TaulaParchiCount = 0;
  TruckLoadingParchi: any[] = [];
  TruckLoadingParchiCount = 0;
  currentPage = 1; 
  perPage = 5; 
  totalItems = 0;
  fromDate: any;
  toDate: any;
  Crops: any[] = [];
  TaulParchiWeightSummary: any[] = [];
  TruckLoadingParchiWeightSummary: any[] = [];
  selectedCrop:any
  tabState: 'truckloading' | 'taulparchi' = 'taulparchi';

  constructor(private apiService: ApiService) {} 

  ngOnInit(): void {
    this.setTabState('taulparchi');
    this.fetchCrops()

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
    if(this.selectedCrop){
      params.crop=this.selectedCrop
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
    if(this.selectedCrop){
      params.crop=this.selectedCrop
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
  fetchCrops() {
    this.apiService.get('crop',{
      params: {
        page: 1,
        limit: 1000
      },
    }).subscribe({
      next: (res: any) => {
        this.Crops = res.data;
      },
      error: (err: any) => {
        console.error('Error fetching Crops:', err);
      }
    });
  }
  getTruckLoadingParchisWeightSummary() {
    let params:any ={}
    if(this.selectedCrop){
      params.crop=this.selectedCrop
    }
    if(this.fromDate){
      params.fromDate=this.fromDate
    }
    if(this.toDate){
      params.toDate=this.toDate
    }
    this.apiService
      .get('truckloading/getWeightsummary', {
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
    if(this.selectedCrop){
      params.crop=this.selectedCrop
    }
    if(this.fromDate){
      params.fromDate=this.fromDate
    }
    if(this.toDate){
      params.toDate=this.toDate
    }
    this.apiService
      .get('taulparchi/getWeightsummary', {
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
