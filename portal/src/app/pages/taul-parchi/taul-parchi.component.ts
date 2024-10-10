import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-taul-parchi',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './taul-parchi.component.html',
  styleUrls: ['./taul-parchi.component.css'],
})
export class TaulParchiComponent implements OnInit {
  Farmers: any[] = [];
  // Villages: any[] = [];
  Hammals: any[] = [];
  Crops: any[] = [];

  TaulParchi = {
    farmer: '',
    village: '',
    mobile: '',
    firm_company: '',
    rate: '',
    tulai: '',
    hammal: '',
    boraQuantity: 0,
    unitBora: 0,
    bharti: 0,
    netWeight: 0,
    purchase: '',
    crop: '',
    id: Date.now(),
    created_at: new Date(),
    createdBy: '',
  };

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fetchFarmers();
    // this.fetchVillages();
    this.fetchHammals();
    this.fetchCrops();
  }

  calculateNetWeight(): void {
    const { boraQuantity, unitBora, bharti } = this.TaulParchi;
    this.TaulParchi.netWeight = (boraQuantity * unitBora) + bharti;
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
          console.log('fgfvasyh', res.data);
        },
        error: (err: any) => {
          console.error('Error fetching Farmers:', err);
        },
      });
  }

  // Fetch Villages from backend
  // fetchVillages() {
  //   this.apiService.get('village',{
  //     params: {
  //       page: 1,
  //       limit: 1000
  //     },
  //   }
  //   ).subscribe({
  //     next: (res: any) => {
  //       this.Villages = res.data;
  //     },
  //     error: (err: any) => {
  //       console.error('Error fetching Villages:', err);
  //     }
  //   });
  // }

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

  // Autofill the firm/company based on the selected farmer
  autoFillFirmOrCompany() {
    const selectedFarmer = this.Farmers.find(
      (farmer) => farmer.name === this.TaulParchi.farmer
    );
    if (selectedFarmer) {
      this.TaulParchi.firm_company = selectedFarmer.firm_company;
    } else {
      this.TaulParchi.firm_company = '';
    }
  }

  // Save TaulParchi to the backend
  saveTaulParchi() {
    if (!this.TaulParchi.farmer) {
      alert('Please select Farmer');
      return;
    }
    if (!this.TaulParchi.village) {
      alert('Please select Village');
      return;
    }
    if (!this.TaulParchi.rate) {
      alert('Please enter Rate');
      return;
    }
    // if (!this.TaulParchi.hammal) {
    //   alert('Please select Hammal');
    //   return;
    // }
    if (!this.TaulParchi.boraQuantity) {
      alert('Please enter Bora');
      return;
    }
    if (!this.TaulParchi.unitBora) {
      alert('Please enter Bora');
      return;
    }
    if (!this.TaulParchi.bharti) {
      alert('Please enter Bharti');
      return;
    }
    if (!this.TaulParchi.crop) {
      alert('Please select Crop');
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
    this.TaulParchi.createdBy = user.id;

    if (this.TaulParchi) {
      this.apiService.post('taulparchi', this.TaulParchi).subscribe({
        next: (res: any) => {
          console.log('TaulParchi saved successfully');
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          console.error('Error saving TaulParchi:', err);
        },
      });
    } else {
      alert('Please fill in all required fields.');
    }
  }
}
