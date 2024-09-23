// import { Component } from '@angular/core';
// import { CommonModule, DatePipe } from '@angular/common';
// import { RouterLink } from '@angular/router';
// import { SharedService } from '../../services/shared.service';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [
//     DatePipe,
//     RouterLink,
//     CommonModule
//   ],
//   templateUrl: './dashboard.component.html',
//   styleUrl: './dashboard.component.css'
// })
// export class DashboardComponent {

//   currentDate = new Date();
//   TaulaParchiCount = 0;
//   TruckLoadingParchiCount = 0;
//   TaulaParchi: any[] = [];
//   TruckLoadingParchi: any[] = [];

//   constructor(
//     private sharedService: SharedService
//   ) {
//     this.TaulaParchiCount = this.sharedService.TaulParchis.length;
//     this.TruckLoadingParchiCount = this.sharedService.TruckLoadingParchis.length;
//     this.getTaulaParchis();
//     this.getTruckLoadingParchis();
//   }

//   getTaulaParchis() {
//     this.TaulaParchi = this.sharedService.TaulParchis;
//   }

//   getTruckLoadingParchis() {
//     this.TruckLoadingParchi = this.sharedService.TruckLoadingParchis;
//   }

// }
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
  Crops: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getTaulaParchis();
    this.getTruckLoadingParchis();
    this.loadDummyCrops();
    
  }
  loadDataFromLocalStorage() {
    const cropsData = localStorage.getItem('crops');  // Load crops from localStorag
    if (cropsData) {  // Check if crops data exists
      this.Crops = JSON.parse(cropsData);
    }
  }
  loadDummyCrops() {
    this.Crops = [
      {
        _id: '1',
        name: 'Wheat',
        created_at: new Date(),
        // farmer: 'John Doe',
        // village: 'Village A',
        // quantity: '100 kg',
        // rate: '20 USD',
        // status: 'Available',
        notes: '80Kg',
      },
      {
        _id: '2',
        name: 'Rice',
        created_at: new Date(),
        farmer: 'Jane Smith',
        village: 'Village B',
        quantity: '200 kg',
        rate: '30 USD',
        status: 'Available',
        notes: '67',
      },
      {
        _id: '3',
        name: 'Corn',
        created_at: new Date(),
        farmer: 'Mike Johnson',
        village: 'Village C',
        quantity: '150 kg',
        rate: '25 USD',
        status: 'Sold Out',
        notes: '93',
      },
      {
        _id: '4',
        name: 'Soybean',
        created_at: new Date(),
        farmer: 'Mike Johnson',
        village: 'Village C',
        quantity: '150 kg',
        rate: '25 USD',
        status: 'Sold Out',
        notes: '93',
      },
    ];
  }

  // Fetch TaulaParchis from backend
  getTaulaParchis() {
    this.apiService
      .get('taulparchi', {
        params: {
          page: 1,
          limit: 1000, // Adjust limit as needed
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
          page: 1,
          limit: 1000, // Adjust limit as needed
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
}
