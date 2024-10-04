import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-list',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    NgxPaginationModule,],
  templateUrl: './my-list.component.html',
  styleUrl: './my-list.component.css'
})
export class MyListComponent {
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
  
    // getTaulaParchis() {
    //   let params:any={
    //     page: this.currentPage,
    //     limit: this.perPage,
    //     // crop:this.selectedCrop
    //   };
    //   if(this.selectedCrop){
    //     params.crop=this.selectedCrop
    //   }
    //   this.apiService
    //     .get('taulparchi/userId/:id', {
    //       params
    //     })
    //     .subscribe({
    //       next: (res: any) => {
    //         this.TaulaParchi = res.data;
    //         console.log('TaulaParchi...', res.data);
  
    //         this.TaulaParchiCount = res.meta.total || this.TaulaParchi.length;
    //       },
    //       error: (err: any) => {
    //         console.error('Error fetching TaulaParchis:', err);
    //       },
    //     });
    // }
    getTaulaParchis() {
      // Get user data from local storage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userData.id;
      console.log("userId",userId)
    
      if (!userId) {
        console.error('User ID not found in local storage.');
        return;
      }
    
      let params: any = {
        page: this.currentPage,
        limit: this.perPage,
      };
    
      if (this.selectedCrop) {
        params.crop = this.selectedCrop;
      }
    
      // Use the extracted userId in the URL
      this.apiService
        .get(`taulparchi/userId/${userId}`, {
          params,
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
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userData.id;
      console.log("userId", userId);
    
      if (!userId) {
        console.error('User ID not found in local storage.');
        return;
      }
    
      let params: any = {
        page: this.currentPage,
        limit: this.perPage,
      };
      
      if (this.selectedCrop) {
        params.crop = this.selectedCrop;
      }
    
      // Use backticks for the URL to include the userId dynamically
      this.apiService
        .get(`truckloading/userId/${userId}`, {
          params,
        })
        .subscribe({
          next: (res: any) => {
            this.TruckLoadingParchi = res.data;
            console.log('loading...', res.data);
            this.TruckLoadingParchiCount = res.meta?.total || this.TruckLoadingParchi.length;
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
    
  }
  

