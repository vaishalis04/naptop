import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    NgxPaginationModule,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
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
  Users: any[] = [];
  TaulParchiWeightSummary: any[] = [];
  TruckLoadingParchiWeightSummary: any[] = [];
  selectedCrop:any;
  selectedUser:any;
  tabState: 'truckloading' | 'taulparchi' = 'taulparchi';

  constructor(private apiService: ApiService,private authService: AuthService) {} 
  ngOnInit(): void {
    this.setTabState('taulparchi');
    this.fetchCrops()
    this.fetchUsers()

  }
  getCurrentUser() {
    return this.authService.currentUser;
  }
  setTabState(newtabstate: 'truckloading' | 'taulparchi') {
    this.tabState = newtabstate;
    this.currentPage = 1;
    if (this.tabState == 'truckloading') {
      this.getTruckLoadingParchis();
     
      
    } else if (this.tabState == 'taulparchi') {
      this.getTaulaParchis();
      
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
          console.log('TaulaParchi...', res.data);

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
  fetchUsers() {
    this.apiService.get('user',{
      params: {
        page: 1,
        limit: 1000
      },
    }).subscribe({
      next: (res: any) => {
        this.Users = res.data;
      },
      error: (err: any) => {
        console.error('Error fetching Users:', err);
      }
    });
  }
}


