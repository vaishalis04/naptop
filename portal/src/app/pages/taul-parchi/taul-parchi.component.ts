import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-taul-parchi',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    DropdownModule
  ],
  templateUrl: './taul-parchi.component.html',
  styleUrls: ['./taul-parchi.component.css'],
})
export class TaulParchiComponent implements OnInit {
  // isEdit: 'Update' | 'Add' | undefined;
  Farmers: any[] = [];
  Hammals: any[] = [];
  Crops: any[] = [];
  Storage: any[] = [];
  Villages: any[] = [];
  firm_company: any[] = [];
  isNewFarmerPopUpOpen = false;
  farmerToAddOrEdit: any = {};

  TaulParchi = {
    farmerName: '',
    farmerMobile: '',
    farmerVillage: '',
    storage: '',
    firm_company: '',
    rate: '',
    tulai: '',
    hammal: '',
    boraQuantity: 0,
    unitBora: 0,
    bharti: 0,
    looseQuantity: 0,
    netWeight: 0,
    purchase: '',
    crop: '',
    amount: 0,
    other: '',
    hammali: 0,
    exemptHammali: 'deduct',
    id: Date.now(),
    created_at: new Date(),
    createdBy: '',
  };
  selectedStorageName: string = '';

  constructor(private apiService: ApiService, private router: Router,    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.fetchFarmers();
    this.fetchVillages();
    this.fetchHammals();
    this.fetchCrops();
    this.fetchStorage()
    this.fetchCompany()
    this.fetchFromLocal()
  }
  fetchFromLocal(){
    const savedStorageId = localStorage.getItem('selectedWarehouseId');
    console.log("hsv",localStorage.getItem('selectedWarehouseId'))
if (savedStorageId) {
  this.TaulParchi.storage = savedStorageId;
  const storageData = localStorage.getItem('selectedWarehouse');
  console.log("Storage Data:", storageData); 
  if (storageData) {
    const selectedStorage = JSON.parse(storageData); // Parse the object
    if (selectedStorage && selectedStorage._id === savedStorageId) {
      this.selectedStorageName = selectedStorage.name; // Assign name to display
      console.log("Selected Storage Name:", this.selectedStorageName);
    } else {
      console.warn("No matching storage found for the savedStorageId.");
    }
  } else {
    console.warn("No storage data found in localStorage.");
  }
} else {
  console.warn("No saved storage ID found in localStorage.");
}
  }
  

  calculateNetWeight(): void {
    const { boraQuantity, bharti, looseQuantity } = this.TaulParchi;
    this.TaulParchi.netWeight = ((boraQuantity * bharti) + looseQuantity) / 100;
  }
  calculateAmount(): void {
    const { netWeight, rate } = this.TaulParchi;
    // const netWeightInQuintals = Number(netWeight) / 100;
    const rateValue = Number(rate);
    const hammaliAmount = this.Hammals.find((hammal) => hammal._id === this.TaulParchi.hammal)?.rate;
    this.TaulParchi.amount = ((netWeight) * rateValue) + (this.TaulParchi.exemptHammali == 'deduct' ? ((hammaliAmount * netWeight) || 0) : 0);
  }
  calculateHammali() {
    // const netWeightQuintal = this.TaulParchi.netWeight / 100;
    const hammaliAmount = this.Hammals.find((hammal) => hammal._id === this.TaulParchi.hammal)?.rate;
    // this.TaulParchi.hammali = netWeightQuintal * hammaliAmount
    this.TaulParchi.hammali = this.TaulParchi.netWeight * hammaliAmount
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
  fetchCompany() {
    this.apiService
      .get('company', {
        params: {
          page: 1,
          limit: 1000,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.firm_company = res.data;
          console.log('fgfvasyh', res.data);
        },
        error: (err: any) => {
          console.error('Error fetching Companies:', err);
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

  // // Autofill the firm/company based on the selected farmer
  // autoFillFirmOrCompany() {
  //   const selectedFarmer = this.Farmers.find(
  //     (farmer) => farmer._id === this.TaulParchi.farmer
  //   );
  //   if (selectedFarmer) {
  //     this.TaulParchi.firm_company = selectedFarmer.firm_company;
  //     this.TaulParchi.village = selectedFarmer.village;
  //   } else {
  //     this.TaulParchi.firm_company = '';
  //   }
  // }

  // Save TaulParchi to the backend
  saveTaulParchi() {
    if (this.TaulParchi.tulai == 'Labour') {
      this.calculateNetWeight();
      this.calculateHammali();
    }
    this.calculateAmount();
    if (!this.TaulParchi.farmerName) {
      alert('Please provide farmer details');
      return;
    }
    if (!this.TaulParchi.farmerVillage) {
      alert('Please provide farmer village details');
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
    if (this.TaulParchi.tulai == 'Labour' && !this.TaulParchi.boraQuantity) {
      alert('Please enter Bora Quantity');
      return;
    }

    if (this.TaulParchi.tulai == 'Labour' && !this.TaulParchi.bharti) {
      alert('Please enter Bharti');
      return;
    }
    // if (!this.TaulParchi.looseQuantity) {
    //   alert('Please enter looseQuantity');
    //   return;
    // }
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
      // console.log('TaulParchi:', this.TaulParchi);
      // return;
      this.apiService.post('taulparchi', this.TaulParchi).subscribe({
        next: (res: any) => {
          console.log('TaulParchi saved successfully');
          // this.router.navigate(['/dashboard']);
          this.router.navigate(['/taul-parchi-view/' + res._id]);
        },
        error: (err: any) => {
          console.error('Error saving TaulParchi:', err);
        },
      });
    } else {
      alert('Please fill in all required fields.');
    }
  }
  getCurrentUser() {
    return this.authService.currentUser;
  }

  openFarmerPopUp() {
    this.isNewFarmerPopUpOpen = true;
  }

  addNewFarmer() {
    if (this.farmerToAddOrEdit.name === '') {
      return;
    }

    this.apiService.post('farmer', this.farmerToAddOrEdit).subscribe(
      {
        next: (data: any) => {
          this.isNewFarmerPopUpOpen = false;
          this.farmerToAddOrEdit = {};
          this.fetchFarmers();
        },
        error: (error: any) => {
          if (error.status === 400) {
            alert('Mobile number already exists. Please use another mobile number.');
          } else {
            alert('An error occurred. Please try again.');
          }
        }
      }
    );
  }
}
