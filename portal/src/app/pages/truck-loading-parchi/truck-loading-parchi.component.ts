import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-truck-loading-parchi',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './truck-loading-parchi.component.html',
  styleUrls: ['./truck-loading-parchi.component.css'],
})
export class TruckLoadingParchiComponent implements OnInit {
  Trucks: any[] = [];
  Parties: any[] = [];
  DeliveryLocations: any[] = [];
  Hammals: any[] = [];
  Crops: any[] = [];
  Storage: any[] = [];
  Transport: any[] = [];

  stockInfo: {
    averagePrice: number;
    crop: string;
    quantity: number;
    bags: any[];
  } = {
    averagePrice: 0,
    crop: '',
    quantity: 0,
    bags: [],
  };

  isStockFetched = false;

  TruckLoadingParchi = {
    transferType: 'Sale',
    partyName: '',
    vehicleNumber: '',
    deliveryLocation: '',
    truck: '',
    assignedHammal: '',
    storage:'',
    boraQuantity: 0,
    unitBora: 0,
    crop: '',
    rate: 0,
    bardanaType:0,
    netWeight: 0, // To be calculated
    amount: 0, // To be calculated
    other: '',
    transport:'',
    advance:0,
    id: Date.now(),
    created_at: new Date(),
    createdBy: '',
  };

  constructor(
    private apiService: ApiService,
    private router: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.fetchParties();
    this.fetchDeliveryLocations();
    this.fetchHammals();
    this.fetchCrops();
    this.fetchTrucks();
    this.fetchStorage()
    this.fetchTransport()
  }

  calculateNetWeight(): void {
    const { boraQuantity, unitBora, bardanaType } = this.TruckLoadingParchi;
    const bardanaInKg = (boraQuantity * (bardanaType/1000)); // Convert bardanaUnit from grams to kilograms
    this.TruckLoadingParchi.netWeight = ((boraQuantity * unitBora) - bardanaInKg)/100;
    this.calculateAmount();
}

  calculateAmount(): void {
    const { netWeight, rate } = this.TruckLoadingParchi;
    this.TruckLoadingParchi.amount = netWeight * rate;
  }

  // Fetch Party Names from backend
  fetchParties() {
    this.apiService
      .get('parties', {
        params: {
          page: 1,
          limit: 1000,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.Parties = res.data;
        },
        error: (err: any) => {
          console.error('Error fetching Parties:', err);
        },
      });
  }

  // Fetch Delivery Locations from backend
  fetchDeliveryLocations() {
    this.apiService
      .get('delivery', {
        params: {
          page: 1,
          limit: 1000,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.DeliveryLocations = res.data;
        },
        error: (err: any) => {
          console.error('Error fetching Delivery Locations:', err);
        },
      });
  }

  // Fetch Hammals from backend
  fetchHammals() {
    this.apiService
      .get('hammals', {
        params: {
          page: 1,
          limit: 1000,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.Hammals = res.data;
        },
        error: (err: any) => {
          console.error('Error fetching Hammals:', err);
        },
      });
  }

  // Fetch Crops from backend
  fetchCrops() {
    this.apiService
      .get('crop', {
        params: {
          page: 1,
          limit: 1000,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.Crops = res.data;
        },
        error: (err: any) => {
          console.error('Error fetching Crops:', err);
        },
      });
  }
  fetchTrucks() {
    this.apiService
      .get('truck', {
        params: {
          page: 1,
          limit: 1000,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.Trucks = res.data;
        },
        error: (err: any) => {
          console.error('Error fetching trucks:', err);
        },
      });
  }
  fetchStorage() {
    this.apiService
      .get('storage', {
        params: {
          page: 1,
          limit: 1000,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.Storage = res.data;
        },
        error: (err: any) => {
          console.error('Error fetching Storage Locations:', err);
        },
      });
  }
  fetchTransport() {
    this.apiService
      .get('transport', {
        params: {
          page: 1,
          limit: 1000,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.Transport = res.data;
        },
        error: (err: any) => {
          console.error('Error fetching Transport Name:', err);
        },
      });
  }
  // Save TruckLoadingParchi to the backend
  saveTruckLoadingParchi() {
    if (!this.TruckLoadingParchi.partyName) {
      alert('Please select Party Name');
      return;
    }
    // if (!this.TruckLoadingParchi.vehicleNumber) {
    //   alert('Please enter Vehicle Number');
    //   return;
    // }
    if (!this.TruckLoadingParchi.deliveryLocation) {
      alert('Please select Delivery Location');
      return;
    }
    if (!this.TruckLoadingParchi.assignedHammal) {
      alert('Please select Hammal');
      return;
    }
    if (!this.TruckLoadingParchi.boraQuantity) {
      alert('Please enter Bora Nag');
      return;
    }
    if (!this.TruckLoadingParchi.unitBora) {
      alert('Please enter Kaanta Weight');
      return;
    }
    if (!this.TruckLoadingParchi.crop) {
      alert('Please enter Jins');
      return;
    }
    if (!this.TruckLoadingParchi.rate) {
      alert('Please enter rate');
      return;
    }
    if (!this.TruckLoadingParchi.other) {
      alert('Please enter Other');
      return;
    }
    let user = null;
    try {
      const storedUserData = localStorage.getItem('user');
      if (storedUserData) {
        user = JSON.parse(storedUserData);
      } else {
        throw new Error('No user data found in localStorage.');
      }
    } catch (error) {
      console.error('Error retrieving user data:');
      alert('Unable to retrieve user data. Please log in again.');
      return;
    }

    if (!user || !user.id) {
      alert('User not logged in. Please log in again.');
      return;
    }

    // Add the createdBy field to TruckLoadingParchi object
    this.TruckLoadingParchi.createdBy = user.id;

    if (this.TruckLoadingParchi) {
      this.apiService.post('truckloading', this.TruckLoadingParchi).subscribe({
        next: (res: any) => {
          console.log('TruckLoadingParchi saved successfully');
          this.router.navigate(['/truck-loading-parchi-view/' + res._id]);
          // this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          console.error('Error saving TruckLoadingParchi:', err);
        },
      });
    } else {
      alert('Please fill in all required fields.');
    }
  }
  // updateBardanaUnit() {
  //   if (this.TruckLoadingParchi.bardanaType === 650) {
  //     this.TruckLoadingParchi.bardanaUnit = 650;
  //   } else if (this.TruckLoadingParchi.bardanaType === 1) {
  //     this.TruckLoadingParchi.bardanaUnit = 1000;
  //   }
  // }

  getStockInfo() {
    const warehouse = this.TruckLoadingParchi.storage;
    if (!warehouse) {
      console.error('Please select a warehouse');
      this.sharedService.addToast(
        {
          header: 'Oops',
          body: 'Please select a warehouse',
          classname: 'bg-danger text-light',
          delay: 5000
        }
      );
      return;
    }

    this.isStockFetched = false;
    this.stockInfo = {
      averagePrice: 0,
      crop: '',
      quantity: 0,
      bags: [],
    };
    this.apiService.get(`stock/warehouse-stock-crop-wise`, {
      params: {
        warehouse,
      },
    }).subscribe({
      next: (res: any) => {
        console.log('Stock Info:', res);
        const crop = this.Crops.find((crop) => crop._id === this.TruckLoadingParchi.crop);
        if (crop) {
          const stockInfo = res.find((stock: any) => stock.crop === crop.name);
          if (stockInfo) {
            this.isStockFetched = true;
            this.stockInfo = stockInfo;
            this.TruckLoadingParchi.rate = stockInfo.averagePrice;
          } else {
            console.error('Please select a valid crop available in the stock');
            this.sharedService.addToast(
              {
                header: 'Oops',
                body: 'Please select a valid crop available in the stock',
                classname: 'bg-danger text-light',
                delay: 5000
              }
            );
          }
        } else {
          console.error('Please select a valid crop available in the stock');
          this.sharedService.addToast(
            {
              header: 'Oops',
              body: 'Please select a valid crop available in the stock',
              classname: 'bg-danger text-light',
              delay: 5000
            }
          );
        }
      },
      error: (err: any) => {
        console.error('Error fetching Stock Info:', err);
      },
    })
  }
}
