import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import ActivatedRoute
import { ApiService } from '../../services/api.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-truck-loading-parchi-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    NgxPaginationModule,
  ],
  templateUrl: './truck-loading-parchi-view.component.html',
  styleUrl: './truck-loading-parchi-view.component.css'
})
export class TruckLoadingParchiViewComponent {
  truckLoadingParchi: any = {}; // Store the specific truckLoadingParchi details here

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute, // Inject ActivatedRoute to capture route parameters
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the ID from the route
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getTruckLoadingParchiById(id);
    }
  }

  // Fetch Taula Parchi by ID
  getTruckLoadingParchiById(id: string) {
    this.apiService.get(`truckloading/${id}`).subscribe({
      next: (res: any) => {
        console.log("res",res)
        this.truckLoadingParchi = res;
      },
      error: (err: any) => {
        console.error('Error fetching Truck Loading Slip details:', err);
      },
    });
  }

  printReceipt() {
    const receiptContent = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Truck Loading Parchi Receipt</title>
      <style>
        body {
          font-family: 'Courier New', monospace;
          margin: 20px;
          background-color: #f8f9fa;
        }
        .card {
          padding: 20px;
          border: 1px solid #000;
          width: 350px;
          margin: 0 auto;
          background-color: white;
        }
        .header {
          text-align: center;
        }
        .section {
          margin-bottom: 15px;
        }
        .row {
          display: flex;
          justify-content: space-between;
        }
        .btn-print {
          display: none;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h4>Truck Loading Parchi</h4>
          <p><b>M+M</b></p>
        </div>
        <hr />
        <div class="section">
          <div class="row">
            <span><b>Serial Number:</b></span>
            <span>${this.getTruckLoadingParchiSrNo(this.truckLoadingParchi.created_at)}</span>
          </div>
          <div class="row">
            <span><b>Date:</b></span>
            <span>${new Date(this.truckLoadingParchi.created_at).toLocaleDateString()}</span>
          </div>
          <div class="row">
            <span><b>Time:</b></span>
            <span>${new Date(this.truckLoadingParchi.created_at).toLocaleTimeString()}</span>
          </div>
          <div class="row">
            <span><b>Party Name:</b></span>
            <span>${this.truckLoadingParchi?.partyDetails.name}</span>
          </div>
          <div class="row">
            <span><b>Truck:</b></span>
            <span>${this.truckLoadingParchi?.truckDetails?.truckNumber}</span>
          </div>
          <div class="row">
            <span><b>Transport Name:</b></span>
            <span>${this.truckLoadingParchi?.transportDetails?.name}</span>
          </div>
          <div class="row">
            <span><b>Delivery Location:</b></span>
            <span>${this.truckLoadingParchi?.deliveryDetails.name}</span>
          </div>
          <div class="row">
            <span><b>Hammal:</b></span>
            <span>${this.truckLoadingParchi?.hammalDetails.name}</span>
          </div>
          <div class="row">
            <span><b>Bora Quantity:</b></span>
            <span>${this.truckLoadingParchi.boraQuantity}</span>
          </div>
          <div class="row">
            <span><b>Unit Bora:</b></span>
            <span>${this.truckLoadingParchi.unitBora}</span>
          </div>
          <div class="row">
            <span><b>Bardana Weight:</b></span>
            <span>${this.truckLoadingParchi?.bardanaType == 1000 ? '1 Kg' : (this.truckLoadingParchi?.bardanaType == 650 ? '0.650 Kg' : 'No Bradana Weight')}</span>
          </div>
          <div class="row">
            <span><b>Net Weight (Quintal):</b></span>
            <span>${this.truckLoadingParchi.netWeight}</span>
          </div>
          <div class="row">
            <span><b>Rate (₹):</b></span>
            <span>${this.truckLoadingParchi.rate.toFixed(2)}</span>
          </div>
          <div class="row">
            <span><b>Freight Advance (₹):</b></span>
            <span>${this.truckLoadingParchi.advance}</span>
          </div>
          <div class="row">
            <span><b>Remark:</b></span>
            <span>${this.truckLoadingParchi.other}</span>
          </div>
        </div>
      </div>
    </body>
  </html>
    `;

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow!.document.write(receiptContent);
    printWindow!.document.close();
    printWindow!.print();
  }

  /**
   * <!-- SRNO. TL{DD}{MM}{YY}{HH}{MM}{SS} -->
            <b>Sr.no:</b> {{ getTruckLoadingParchiSrNo(truckLoadingParchi?.created_at) }}
   */
  getTruckLoadingParchiSrNo(created_at: string): string {
    if (created_at) {
      const date = new Date(created_at);
      // const srNo = `TL${date.getDate()}${date.getMonth()}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
      // with leading zeros
      const srNo = `TL${date.getDate().toString().padStart(2, '0')}${date.getMonth().toString().padStart(2, '0')}${date.getFullYear()}${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;
      return srNo;
    }
    return '';
  }

  // Navigate back to the previous page
  goBack() {
    this.router.navigate(['/truck-loading-parchi-dashboard']); // Adjust the route as needed
  }
}
