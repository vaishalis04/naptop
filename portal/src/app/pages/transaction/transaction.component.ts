import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent implements OnInit  {
  Farmers: any[] = [];
  Villages: any[] = [];
  Hammals: any[] = [];
  Crops: any[] = [];

  transaction={
    farmer:"",
    village:"",
    firm_company:"",
    rate: '',
    hammal: '',
    boraQuantity: 0,
    unitBora: 0,
    bharti: 0,
    netWeight:0,
    crop: '',
    PaymentStatus:'',
    id: Date.now(),
    created_at: new Date(),
    transactionStatus:'',
    transactionMode:'',
    discount:0,
    paidAmount:0,
    remainingAmount:0,
    totalAmount:0
  }
  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchFarmers();
    this.fetchVillages();
    this.fetchHammals();
    this.fetchCrops();
  }

  calculateNetWeight(): void {
    const { boraQuantity, unitBora, bharti } = this.transaction;
    this.transaction.netWeight = (boraQuantity * unitBora) + bharti
  }

   // Fetch Farmers from backend
   fetchFarmers() {
    this.apiService.get('farmer', {
        params: {
          page: 1,
          limit: 1000
        },
      }
    ).subscribe({
      next: (res: any) => {
        this.Farmers = res.data;
      },
      error: (err: any) => {
        console.error('Error fetching Farmers:', err);
      }
    });
  }

  // Fetch Villages from backend
  fetchVillages() {
    this.apiService.get('village',{
      params: {
        page: 1,
        limit: 1000
      },
    }
    ).subscribe({
      next: (res: any) => {
        this.Villages = res.data;
      },
      error: (err: any) => {
        console.error('Error fetching Villages:', err);
      }
    });
  }

  // Fetch Hammals from backend
  fetchHammals() {
    this.apiService.get('hammals',{
      params: {
        page: 1,
        limit: 1000
      },
    }).subscribe({
      next: (res: any) => {
        this.Hammals = res.data;
      },
      error: (err: any) => {
        console.error('Error fetching Hammals:', err);
      }
    });
  }

  // Fetch Crops from backend
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

  autoFillFirmOrCompany() {
    const selectedFarmer = this.Farmers.find(farmer => farmer.name === this.transaction.farmer);
    if (selectedFarmer) {
      this.transaction.firm_company = selectedFarmer.firm_company;
    } else {
      this.transaction.firm_company = '';
    }
  }

  saveTransaction() {
    if (!this.transaction.farmer) {
            alert('Please select Farmer');
            return;
          }
          if (!this.transaction.village) {
            alert('Please select Village');
            return;
          }
          if (!this.transaction.rate) {
            alert('Please enter Rate');
            return;
          }
          if (!this.transaction.hammal) {
            alert('Please select Hammal');
            return;
          }
          if (!this.transaction.boraQuantity) {
            alert('Please enter Bora');
            return;
          }
          if (!this.transaction.unitBora) {
            alert('Please enter Bora');
            return;
          }
          if (!this.transaction.bharti) {
            alert('Please enter Bharti');
            return;
          }
          if (!this.transaction.crop) {
            alert('Please select Crop');
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
        }
      });
    } else {
      alert('Please fill in all required fields.');
    }
  }

}
