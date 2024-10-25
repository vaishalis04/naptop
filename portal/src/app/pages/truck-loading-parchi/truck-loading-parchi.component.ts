// import { Component } from '@angular/core';
// import { SharedService } from '../../services/shared.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-truck-loading-parchi',
//   standalone: true,
//   imports: [
//     FormsModule,
//     ReactiveFormsModule,
//     CommonModule
//   ],
//   templateUrl: './truck-loading-parchi.component.html',
//   styleUrl: './truck-loading-parchi.component.css'
// })
// export class TruckLoadingParchiComponent {

//   /**
//    * Party Name - Dropdown
//    * Vehicle Number - Text
//    * Delivery Location - Dropdown
//    * Hammal - Dropdown
//    * Bora Nag - Number
//    * Kaanta Weight - Number
//    * jins - Number
//    * Other - Text
//    */

//   Parties: any[] = [];

//   DeliveryLocations: any[] = [];

//   Hammals: any[] = [];

//   TruckLoadingParchi = {
//     party_name: '',
//     vehicle_number: '',
//     delivery_location: '',
//     hammal: '',
//     bora_nag: '',
//     kaanta_weight: '',
//     jins: '',
//     other: '',
//     id: Date.now(),
//     created_at: new Date(),
//   }

//   constructor(
//     private sharedService: SharedService,
//     private router: Router
//   ) {
//     this.Parties = this.sharedService.Parties;
//     this.DeliveryLocations = this.sharedService.DeliveryLocations;
//     this.Hammals = this.sharedService.Hammals;
//   }

//   saveTruckLoadingParchi() {
//     if (!this.TruckLoadingParchi.party_name) {
//       alert('Please select Party Name');
//       return;
//     }
//     if (!this.TruckLoadingParchi.vehicle_number) {
//       alert('Please enter Vehicle Number');
//       return;
//     }
//     if (!this.TruckLoadingParchi.delivery_location) {
//       alert('Please select Delivery Location');
//       return;
//     }
//     if (!this.TruckLoadingParchi.hammal) {
//       alert('Please select Hammal');
//       return;
//     }
//     if (!this.TruckLoadingParchi.bora_nag) {
//       alert('Please enter Bora Nag');
//       return;
//     }
//     if (!this.TruckLoadingParchi.kaanta_weight) {
//       alert('Please enter Kaanta Weight');
//       return;
//     }
//     if (!this.TruckLoadingParchi.jins) {
//       alert('Please enter Jins');
//       return;
//     }
//     if (!this.TruckLoadingParchi.other) {
//       alert('Please enter Other');
//       return;
//     }
//     if (confirm('Are you sure you want to save this Truck Loading Parchi?')) {
//       this.sharedService.addItem('Truck Loading Parchis', this.TruckLoadingParchi);
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


  TruckLoadingParchi = {
    partyName: '',
    vehicleNumber: '',
    deliveryLocation: '',
    truck: '',
    assignedHammal: '',
    storage:'',
    boraQuantity: 0,
    unitBora: 0,
    crop: 0,
    rate: 0,
    bardanaBag650g: 0,
    bardanaBag1kg: 0,
    bardanaType:0,
    bardanaUnit:0,
    netWeight: 0, // To be calculated
    amount: 0, // To be calculated
    other: '',
    transport:'',
    advance:'',
    id: Date.now(),
    created_at: new Date(),
    createdBy: '',
  };

  constructor(private apiService: ApiService, private router: Router) {}

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
    const { boraQuantity, unitBora, bardanaUnit } = this.TruckLoadingParchi;
    const bardanaInKg = bardanaUnit / 1000; // Convert bardanaUnit from grams to kilograms
    this.TruckLoadingParchi.netWeight = (boraQuantity * unitBora) - bardanaInKg;
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
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          console.error('Error saving TruckLoadingParchi:', err);
        },
      });
    } else {
      alert('Please fill in all required fields.');
    }
  }
  updateBardanaUnit() {
    if (this.TruckLoadingParchi.bardanaType === 650) {
      this.TruckLoadingParchi.bardanaUnit = 650;
    } else if (this.TruckLoadingParchi.bardanaType === 1) {
      this.TruckLoadingParchi.bardanaUnit = 1000; 
    } 
  }
  
  
  
  
  
}
