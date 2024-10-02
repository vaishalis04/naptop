import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
})
export class TransactionComponent implements OnInit {
  Farmers: any[] = [];
  Villages: any[] = [];
  Hammals: any[] = [];
  Crops: any[] = [];
  TaulaParchi: any[] = [];
  selectedCrop:any
  TaulaParchiCount = 0;
  TruckLoadingParchi: any[] = [];
  TruckLoadingParchiCount = 0;
  transactions = {
    transactionStatus: '',
    transactionDetails: '',
    
  };

  transaction = {
    farmer: '',
    village: '',
    firm_company: '',
    rate: '',
    hammal: '',
    boraQuantity: 0,
    unitBora: 0,
    bharti: 0,
    netWeight: 0,
    crop: '',
    PaymentStatus: '',
    id: Date.now(),
    created_at: new Date(),
    transactionStatus: '',
    transactionMode: '',
    transactionType:'',
    discount: 0,
    paidAmount: 0,
    remainingAmount: 0,
    totalAmount: 0,
  };
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fetchFarmers();
    this.fetchVillages();
    this.fetchHammals();
    this.fetchCrops();
    this.getTaulaParchis()
    this.getTruckLoadingParchis() 
  }

  calculateNetWeight(): void {
    const { boraQuantity, unitBora, bharti } = this.transaction;
    this.transaction.netWeight = boraQuantity * unitBora + bharti;
  }

  // Fetch Farmers from backend
  fetchFarmers() {
    this.apiService
      .get('farmer', {
        params: {
          page: 1,
          limit: 1000,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.Farmers = res.data;
        },
        error: (err: any) => {
          console.error('Error fetching Farmers:', err);
        },
      });
  }

  // Fetch Villages from backend
  fetchVillages() {
    this.apiService
      .get('village', {
        params: {
          page: 1,
          limit: 1000,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.Villages = res.data;
        },
        error: (err: any) => {
          console.error('Error fetching Villages:', err);
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

  autoFillFirmOrCompany() {
    const selectedFarmer = this.Farmers.find(
      (farmer) => farmer.name === this.transaction.farmer
    );
    if (selectedFarmer) {
      this.transaction.firm_company = selectedFarmer.firm_company;
    } else {
      this.transaction.firm_company = '';
    }
  }
  getTaulaParchis() {
    let params;
   
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
    let params
   
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
  
  saveTransaction() 
  {
    if (!this.transaction.transactionStatus) {
      alert('Please select Farmer');
      return;
    }
    
    if (this.transaction) {
      this.apiService.post('transaction', this.transaction).subscribe({
        next: (res: any) => {
          console.log('transaction saved successfully');
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          console.error('Error saving transaction:', err);
        },
      });
    } else {
      alert('Please fill in all required fields.');
    }
  }
  calculateRemainingAmount() {
    const discountedTotal = this.transaction.totalAmount - this.transaction.discount;
    this.transaction.remainingAmount = discountedTotal - this.transaction.paidAmount;

    // Ensure remainingAmount is never negative
    if (this.transaction.remainingAmount < 0) {
      this.transaction.remainingAmount = 0;
    }
  }
}
