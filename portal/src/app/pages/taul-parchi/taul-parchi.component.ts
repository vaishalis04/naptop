// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { SharedService } from '../../services/shared.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-taul-parchi',
//   standalone: true,
//   imports: [
//     FormsModule,
//     ReactiveFormsModule,
//     CommonModule
//   ],
//   templateUrl: './taul-parchi.component.html',
//   styleUrl: './taul-parchi.component.css'
// })
// export class TaulParchiComponent {

//   /**
//     * Farmer's Name (Kisaan Ka naam) - Dropdown
//     * Village - Dropdown
//     * Firm / Company - (Autofill)
//     * Rate (Dar) - Number (with rupee icon)
//     * Assigned Hammal (Hammal Mukaddam) - Dropdown
//     * Bora - Number
//     * Bharti - Number
//     * Crop (Fasal) - Dropdown
//    */
//   Farmers: any[] = [];

//   Villages: any[] = [];

//   Hammals: any[] = [];

//   Crops: any[] = [];

//   TaulParchi = {
//     farmer: '',
//     village: '',
//     firm_company: '',
//     rate: '',
//     hammal: '',
//     bora: '',
//     bharti: '',
//     crop: '',
//     id: Date.now(),
//     created_at: new Date(),
//   }

//   constructor(
//     private sharedService: SharedService,
//     private router: Router
//   ) {
//     this.Farmers = this.sharedService.Farmers;
//     this.Villages = this.sharedService.Villages;
//     this.Hammals = this.sharedService.Hammals;
//     this.Crops = this.sharedService.Crops;
//   }

//   autoFillFirmOrCompany() {
//     const selectedFarmer = this.Farmers.find(farmer => farmer.name === this.TaulParchi.farmer);
//     if (selectedFarmer) {
//       this.TaulParchi.firm_company = selectedFarmer.firm_company;
//     } else {
//       this.TaulParchi.firm_company = '';
//     }
//   }

//   saveTaulParchi() {
//     // Validations
//     if (!this.TaulParchi.farmer) {
//       alert('Please select Farmer');
//       return;
//     }
//     if (!this.TaulParchi.village) {
//       alert('Please select Village');
//       return;
//     }
//     if (!this.TaulParchi.rate) {
//       alert('Please enter Rate');
//       return;
//     }
//     if (!this.TaulParchi.hammal) {
//       alert('Please select Hammal');
//       return;
//     }
//     if (!this.TaulParchi.bora) {
//       alert('Please enter Bora');
//       return;
//     }
//     if (!this.TaulParchi.bharti) {
//       alert('Please enter Bharti');
//       return;
//     }
//     if (!this.TaulParchi.crop) {
//       alert('Please select Crop');
//       return;
//     }
//     if (confirm('Are you sure you want to save this Taul Parchi?')) {
//       this.sharedService.addItem('Taul Parchis', this.TaulParchi);
//       this.router.navigate(['/dashboard']);
//     }
//   }
// }
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-taul-parchi',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './taul-parchi.component.html',
  styleUrls: ['./taul-parchi.component.css']
})
export class TaulParchiComponent implements OnInit {
  Farmers: any[] = [];
  Villages: any[] = [];
  Hammals: any[] = [];
  Crops: any[] = [];

  TaulParchi = {
    farmer: '',
    village: '',
    firm_company: '',
    rate: '',
    hammal: '',
    boraQuantity: 0,
    unitBora: 0,
    bharti: 0,
    netWeight:0,
    crop: '',
    id: Date.now(),
    created_at: new Date(),
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
    const { boraQuantity, unitBora, bharti } = this.TaulParchi;
    this.TaulParchi.netWeight = (boraQuantity * unitBora) + bharti
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

  // Autofill the firm/company based on the selected farmer
  autoFillFirmOrCompany() {
    const selectedFarmer = this.Farmers.find(farmer => farmer.name === this.TaulParchi.farmer);
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
          if (!this.TaulParchi.hammal) {
            alert('Please select Hammal');
            return;
          }
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
    if (this.TaulParchi) {
      this.apiService.post('taulparchi', this.TaulParchi).subscribe({
        next: (res: any) => {
          console.log('TaulParchi saved successfully');
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          console.error('Error saving TaulParchi:', err);
        }
      });
    } else {
      alert('Please fill in all required fields.');
    }
  }
}
