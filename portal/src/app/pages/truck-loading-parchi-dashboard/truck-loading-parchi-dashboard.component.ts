import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-truck-loading-parchi-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    NgxPaginationModule,
    RouterModule,
  ],
  templateUrl: './truck-loading-parchi-dashboard.component.html',
  styleUrl: './truck-loading-parchi-dashboard.component.css'
})
export class TruckLoadingParchiDashboardComponent {
  TruckLoadingParchis: any[] = [];
  TruckLoadingParchiCount = 0;
  currentPage = 1;
  perPage = 5;
  totalItems = 0;
  fromDate: any;
  toDate: any;
  Storage: any[] = [];

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.getTruckLoadingParchis();
  }

  getTruckLoadingParchis() {
    let params: any = {
      page: this.currentPage,
      limit: this.perPage,
    };

    this.apiService
      .get('truckloading', {
        params,
      })
      .subscribe({
        next: (res: any) => {
          // this.TaulaParchi = res.data;
          // this.TaulaParchiCount = res.meta.total || this.truckLoadingParchi.length;
          this.TruckLoadingParchis = res.data;
          this.TruckLoadingParchiCount = res.meta.total || this.TruckLoadingParchis.length;
        },
        error: (err: any) => {
          console.error('Error fetching TaulaParchis:', err);
        },
      });
  }

  printReceipt(truckLoadingParchi: any) {
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
            <span>${truckLoadingParchi?.sno}</span>
          </div>
          <div class="row">
            <span><b>Date:</b></span>
            <span>${new Date(truckLoadingParchi.created_at).toLocaleDateString()}</span>
          </div>
          <div class="row">
            <span><b>Time:</b></span>
            <span>${new Date(truckLoadingParchi.created_at).toLocaleTimeString()}</span>
          </div>
          <div class="row">
            <span><b>Party Name:</b></span>
            <span>${truckLoadingParchi?.partyDetails.name}</span>
          </div>
          <div class="row">
            <span><b>Truck:</b></span>
            <span>${truckLoadingParchi?.truckDetails?.truckNumber}</span>
          </div>
          <div class="row">
            <span><b>Transport Name:</b></span>
            <span>${truckLoadingParchi?.transportDetails?.name}</span>
          </div>
          <div class="row">
            <span><b>Delivery Location:</b></span>
            <span>${truckLoadingParchi?.deliveryDetails.name}</span>
          </div>
          <div class="row">
            <span><b>Hammal:</b></span>
            <span>${truckLoadingParchi?.hammalDetails.name}</span>
          </div>
          <div class="row">
            <span><b>Bora Quantity:</b></span>
            <span>${truckLoadingParchi.boraQuantity}</span>
          </div>
          <div class="row">
            <span><b>Unit Bora:</b></span>
            <span>${truckLoadingParchi.unitBora}</span>
          </div>
          <div class="row">
            <span><b>Bardana Weight:</b></span>
            <span>${truckLoadingParchi?.bardanaType == 1000 ? '1 Kg' : (truckLoadingParchi?.bardanaType == 650 ? '0.650 Kg' : 'No Bradana Weight')}</span>
          </div>
          <div class="row">
            <span><b>Dried Weight:</b></span>
            <span>${truckLoadingParchi.driedWeight} Kgs</span>
          </div>
          <div class="row">
            <span><b>Net Weight (Quintal):</b></span>
            <span>${truckLoadingParchi.netWeight}</span>
          </div>
          <div class="row">
            <span><b>Rate (₹):</b></span>
            <span>${truckLoadingParchi.rate.toFixed(2)}</span>
          </div>
          <div class="row">
            <span><b>Freight Advance (₹):</b></span>
            <span>${truckLoadingParchi.advance}</span>
          </div>
          <div class="row">
            <span><b>Remark:</b></span>
            <span>${truckLoadingParchi.other}</span>
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

  // Helper function to generate the Sr.No based on created_at timestamp
  getTruckLoadingParchiSrNo(created_at: string): string {
    if (created_at) {
      const date = new Date(created_at);
      const srNo = `TL${date.getDate().toString().padStart(2, '0')}${(date.getMonth() + 1).toString().padStart(2, '0')}${date
        .getFullYear()
        .toString()
        .substr(2)}${date.getHours().toString().padStart(2, '0')}${date.getMinutes()
          .toString()
          .padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;
      return srNo;
    }
    return '';
  }

  deleteTruckLoadingParchi(truckLoadingParchiId: any) {
    if (confirm('Are you sure you want to delete this Truck Loading Parchi?')) {
      this.apiService.delete(`truckloading/${truckLoadingParchiId}`).subscribe({
        next: (res: any) => {
          this.getTruckLoadingParchis();
        },
        error: (err: any) => {
          console.error('Error deleting Truck Loading Parchi:', err);
        },
      });
    }
  }

  sendToPrintReceipt(truckLoadingParchi: any) {
    this.apiService.put(`truckloading/${truckLoadingParchi._id}`, {
      enableToPrint: true,
      enableToPrintBy: this.authService?.currentUser?.email || 'N/A',
    }).subscribe({
      next: (res: any) => {
        console.log('Truck Loading Parchi updated:', res);
        alert('Sent to printer.');
        // this.printReceipt(taulaParchi);
      },
      error: (err: any) => {
        console.error('Error updating Truck Loading Parchi:', err);
      },
    });
  }
}
