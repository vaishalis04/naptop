// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
// import { ApiService } from '../../services/api.service';
// import { ActivatedRoute, Router } from '@angular/router';

// @Component({
//   selector: 'app-transaction',
//   standalone: true,
//   imports: [FormsModule, ReactiveFormsModule, CommonModule],
//   templateUrl: './transaction.component.html',
//   styleUrl: './transaction.component.css',
// })
// export class TransactionComponent implements OnInit {
// taulaParchi: any = {};
//   TaulaParchi: any[] = [];
//   TaulaParchiCount = 0;

//   updateTaulparchi = {
//     farmerName: '',
//     farmerMobile: '',
//     farmerVillage: '',
//     purchase: '',
//     storage: '',
//     firm_company: '',
//     rate: '',
//     tulai: '',
//     hammal: '',
//     boraQuantity: 0,
//     unitBora: 0,
//     bharti: 0,
//     looseQuantity: 0,
//     netWeight: 0,
//     crop: '',
//     amount: 0,
//     transactionType:'',
//     other: '',
//     hammali: 0,
//     exemptHammali: 'deduct',
//     id: Date.now(),
//     created_at: new Date(),
//     createdBy: '',
//   };
//   constructor(
//     private apiService: ApiService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {
    
//   }

//   ngOnInit(): void {
//     const id = this.route.snapshot.paramMap.get('id');
//     if (id) {
//       this.getTaulaParchiById(id);
//     }
//   }
//   getTaulaParchiById(id: string) {
//     this.apiService.get(`taulparchi/${id}`).subscribe({
//       next: (res: any) => {
//         console.log("res",res)
//         this.taulaParchi = res;
//         console.log("taulparchi",res)
//       },
//       error: (err: any) => {
//         console.error('Error fetching Taula Parchi details:', err);
//       },
//     });
//   }

//   saveParchi() {
//     if (this.taulaParchi && Object.keys(this.taulaParchi).length > 0) {
//         this.apiService.put(`taulparchi/${this.taulaParchi.id}`, this.updateTaulparchi).subscribe({
//         next: (res: any) => {
//           console.log('taulparchi saved successfully');
//           this.router.navigate(['/dashboard']);
//         },
//         error: (err: any) => {
//           console.error('Error saving taulparchi:', err);
//         },
//       });
//     } else {
//       alert('Please fill in all required fields.');
//     }
//   }
// }
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ApiService } from '../../services/api.service';
// import { ActivatedRoute, Router } from '@angular/router';

// @Component({
//   selector: 'app-transaction',
//   standalone: true,
//   imports: [FormsModule, ReactiveFormsModule, CommonModule],
//   templateUrl: './transaction.component.html',
//   styleUrl: './transaction.component.css',
// })
// export class TransactionComponent implements OnInit {
//   taulaParchi: any = {};
//   updateTaulparchi: any = {
//     farmerName: '',
//     farmerMobile: '',
//     farmerVillage: '',
//     purchase: '',
//     storage: '',
//     firm_company: '',
//     rate: '',
//     tulai: '',
//     hammal: '',
//     boraQuantity: 0,
//     unitBora: 0,
//     bharti: 0,
//     looseQuantity: 0,
//     netWeight: 0,
//     crop: '',
//     amount: 0,
//     transactionType: '',
//     other: '',
//     hammali: 0,
//     exemptHammali: 'deduct',
//     id: Date.now(),
//     created_at: new Date(),
//     createdBy: '',
//   };

//   constructor(
//     private apiService: ApiService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {}

//   ngOnInit(): void {
//     const id = this.route.snapshot.paramMap.get('id');
//     if (id) {
//       this.getTaulaParchiById(id);
//     }
//   }

//   getTaulaParchiById(id: string) {
//     this.apiService.get(`taulparchi/${id}`).subscribe({
//       next: (res: any) => {
//         this.taulaParchi = res;
//         // Populate updateTaulparchi with taulaParchi data
//         this.updateTaulparchi = { ...this.taulaParchi };
//       },
//       error: (err: any) => {
//         console.error('Error fetching Taula Parchi details:', err);
//       },
//     });
//   }

//   saveParchi() {
//     if (this.taulaParchi && Object.keys(this.taulaParchi).length > 0) {
//       this.apiService.put(`taulparchi/${this.taulaParchi.id}`, this.updateTaulparchi).subscribe({
//         next: (res: any) => {
//           console.log('Taula Parchi updated successfully');
//           this.router.navigate(['/dashboard']);
//         },
//         error: (err: any) => {
//           console.error('Error saving Taula Parchi:', err);
//         },
//       });
//     } else {
//       alert('Please fill in all required fields.');
//     }
//   }
// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css'],
})
export class TransactionComponent implements OnInit {
  taulaParchi: any = {};
  updateTaulparchi: any = {
    farmerName: '',
    farmerMobile: '',
    farmerVillage: '',
    purchase: '',
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
    crop: '',
    amount: 0,
    transactionType: '',
    other: '',
    hammali: 0,
    exemptHammali: 'deduct',
    id: Date.now(),
    created_at: new Date(),
    createdBy: '',
  };
  transactionId: string | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.transactionId = this.route.snapshot.paramMap.get('id'); // Store the ID from the route

    if (this.transactionId) {
      this.getTaulaParchiById(this.transactionId);
    }
  }

  getTaulaParchiById(id: string) {
    this.apiService.get(`taulparchi/${id}`).subscribe({
      next: (res: any) => {
        this.taulaParchi = res;
        this.updateTaulparchi = { ...this.taulaParchi }; // Populate updateTaulparchi with fetched data
      },
      error: (err: any) => {
        console.error('Error fetching Taula Parchi details:', err);
      },
    });
  }

  saveParchi() {
    if (this.transactionId) {
      const updateData = { transactionType: this.updateTaulparchi.transactionType };
  
      this.apiService.patch(`taulparchi/${this.transactionId}`, updateData).subscribe({
        next: (res: any) => {
          console.log('Taula Parchi updated successfully',updateData);
          this.router.navigate(['/dashboard']); // Redirect to dashboard after successful update
        },
        error: (err: any) => {
          console.error('Error saving Taula Parchi:', err);
          alert('Failed to save Taula Parchi. Please try again.');
        },
      });
    } else {
      alert('Please fill in all required fields.');
    }
  }
  
 
  
  
}
