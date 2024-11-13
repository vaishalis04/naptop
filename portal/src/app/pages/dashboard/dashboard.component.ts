import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthService } from '../../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    CommonModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  currentDate = new Date();
  TaulaParchiCount = 0;
  TruckLoadingParchiCount = 0;
  TaulaParchi: any[] = [];
  TruckLoadingParchi: any[] = [];
  pageForTaulaParchi = 1;
  pageForTruckLoadingParchi = 1;
  warehouses: any[] = [];
  currentUser: any;

  crops: any[] = [];
  storages: any[] = [];
  farmerNameSearch = '';
  farmerMobileSearch = '';
  farmerVillageSearch = '';
  selectedWarehouse: any;
  selectedCrop: any;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.getTaulaParchis();
    this.getTruckLoadingParchis();
    this.getWarehouses();
    this.getCrops();
  }

  getCrops() {
    this.apiService
      .get('crop', {
        params: {
          page: 1,
          limit: 1000,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.crops = res.data;
        },
        error: (err: any) => {
          console.error('Error fetching crops:', err);
        },
      });
  }

  // Fetch TaulaParchis from backend
  getTaulaParchis() {
    const query: any = {};
    if (this.farmerNameSearch) {
      query['farmerName'] = this.farmerNameSearch;
    }
    if (this.farmerMobileSearch) {
      query['farmerMobile'] = this.farmerMobileSearch;
    }
    if (this.farmerVillageSearch) {
      query['farmerVillage'] = this.farmerVillageSearch;
    }
    if (this.selectedWarehouse) {
      query['warehouse'] = this.selectedWarehouse;
    }
    if (this.selectedCrop) {
      query['crop'] = this.selectedCrop;
    }

    this.apiService
      .get('taulparchi', {
        params: {
          page: this.pageForTaulaParchi,
          limit: 10,
          ...query,
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

  // Fetch TruckLoadingParchis from backend
  getTruckLoadingParchis() {
    this.apiService
      .get('truckloading', {
        params: {
          page: this.pageForTruckLoadingParchi,
          limit: 10,
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

  getWarehouses() {
    // get storage locations
    this.apiService.get('storage', {
      params: {
        page: 1,
        limit: 1000,
      },
    }).subscribe({
      next: (res: any) => {
        this.warehouses = Object.values(res.data);
        for (const warehouse of this.warehouses) {
          this.apiService.get(`stock/warehouse-stock-crop-wise`, {
            params: {
              warehouse: warehouse._id,
            },
          }).subscribe({
            next: (res: any) => {
              this.warehouses = this.warehouses.map((w) => {
                if (w._id === warehouse._id) {
                  w.stock = res;
                }
                return w;
              });
              console.log(this.warehouses);
            },
            error: (err: any) => {
              console.error('Error fetching warehouse stock:', err);
            },
          });
        }
      },
      error: (err: any) => {
        console.error('Error fetching warehouses:', err);
      },
    });
  }
}
