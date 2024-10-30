import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule, DatePipe, } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';
import { QRCodeModule,QRCodeElementType } from 'angularx-qrcode';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-taulparchi-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    NgxPaginationModule,
    RouterModule,
    QRCodeModule
  ],
  templateUrl: './taulparchi-dashboard.component.html',
  styleUrl: './taulparchi-dashboard.component.css',
})
export class TaulparchiDashboardComponent {
  TaulaParchi: any[] = [];
  TaulaParchiCount = 0;
  TruckLoadingParchi: any[] = [];
  TruckLoadingParchiCount = 0;
  currentPage = 1;
  perPage = 5;
  totalItems = 0;
  fromDate: any;
  toDate: any;
  Storage: any[] = [];
  qrCodeUrl: string | null = null;
  currentUser: any = {};


  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.getTaulaParchis();
    this.authService.setCurrentUser();
  }

  getTaulaParchis() {
    let params: any = {
      page: this.currentPage,
      limit: this.perPage,
    };

    this.apiService
      .get('taulparchi', {
        params,
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
  generateQRCode(data: string) {
    this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${data}&size=150x150`;
  }

  printReceipt(taulaParchi: any) {
    this.generateQRCode(taulaParchi._id || 'N/A');
    // Format the receipt content as HTML
    const receiptContent = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Taula Parchi Receipt</title>
      <link
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <style>
        body {
          font-family: 'Courier New', monospace;
          margin: 20px;
          background-color: #f8f9fa;
        }

        .card {
          padding: 20px;
          border: 1px solid #000;
          width: 350px; /* Restrict width for a vertical look */
          margin: 0 auto; /* Center the box horizontally */
          background-color: white;
        }

        h1, h4 {
          text-align: center;
        }

        .section {
          margin-bottom: 15px;
          padding-bottom: 10px;
        }

        .section-title {
          font-weight: bold;
          margin-bottom: 10px;
          text-align: center;
        }

        .row {
          display: flex;
          justify-content: space-between;
        }

        .row .label {
          text-align: left;
          width: 50%;
        }

        .row .value {
          text-align: right;
          width: 50%;
        }

        .btn-print {
          background-color: #007bff;
          color: white;
          padding: 10px 20px;
          font-size: 16px;
          border: none;
          display: block;
          margin: 20px auto;
        }

        .btn-print:hover {
          background-color: #0056b3;
        }
        /* Hide print button when printing */
        @media print {
          .btn-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="container mt-4">
        <div class="card">
          <h4 class="mb-2">Taula Parchi Receipt</h4>
          <p class="text-center"><b>M+M</b></p>

          <!-- Sr. No and Date Section -->

          <div class="section">
            <div class="row">
              <div class="label"><b>Sr.No:</b></div>
              <div class="value">${this.getTaulaParchiSrNo(taulaParchi?.created_at)}</div>
            </div>
            <div class="row">
              <div class="label"><b>Date:</b></div>
              <div class="value">${new Date(taulaParchi?.created_at).toLocaleDateString()}</div>
            </div>
            <div class="row">
              <div class="label"><b>Time:</b></div>
              <div class="value">${new Date(taulaParchi?.created_at).toLocaleTimeString()}</div>
            </div>
          </div>

          <!-- Farmer and Crop Details -->

          <div class="section">
            <div class="row">
              <div class="label"><b>Farmer's Name:</b></div>
              <div class="value">${taulaParchi.farmerDetails?.name || 'N/A'}</div>
            </div>
            <div class="row">
              <div class="label"><b>Village:</b></div>
              <div class="value">${taulaParchi.farmerDetails?.village || 'N/A'}</div>
            </div>
            <div class="row">
              <div class="label"><b>Mobile:</b></div>
              <div class="value">${taulaParchi.farmerDetails?.mobile || 'N/A'}</div>
            </div>
            <div class="row">
              <div class="label"><b>Storage Location:</b></div>
              <div class="value">${taulaParchi.wearhouseDetails?.name || 'N/A'}</div>
            </div>
            <div class="row">
              <div class="label"><b>Crop:</b></div>
              <div class="value">${taulaParchi.cropDetails?.name || 'N/A'}</div>
            </div>
          </div>

          <!-- Purchase and Firm Details -->
          <div class="section">
            <div class="row">
              <div class="label"><b>Purchase Status:</b></div>
              <div class="value">${taulaParchi.purchase || 'N/A'}</div>
            </div>
            <div class="row">
              <div class="label"><b>Firm/Company:</b></div>
              <div class="value">${taulaParchi.companyDetails.name || 'N/A'}</div>
            </div>
          </div>

          <!-- Additional Fields -->
          <div class="section">
            <div class="row">
              <div class="label"><b>Rate (₹):</b></div>
              <div class="value">${taulaParchi.rate || 'N/A'}</div>
            </div>
            <div class="row">
              <div class="label"><b>Tulai Option:</b></div>
              <div class="value">${taulaParchi.tulai || 'N/A'}</div>
            </div>
            <div class="row">
              <div class="label"><b>Exempt Hammali:</b></div>
              <div class="value">${
                taulaParchi.exemptHammali ? (taulaParchi.exemptHammali === 'deduct' ? 'Deduct' : 'Exempted') : 'N/A'
              }</div>
            </div>
            <div class="row">
              <div class="label"><b>Hammal:</b></div>
              <div class="value">${taulaParchi?.hammalDetails?.name || 'N/A'}</div>
            </div>
            <div class="row">
              <div class="label"><b>Bora Quantity:</b></div>
              <div class="value">${taulaParchi.boraQuantity || 'N/A'}</div>
            </div>
            <div class="row">
              <div class="label"><b>Bharti (in Kgs):</b></div>
              <div class="value">${taulaParchi.bharti || 'N/A'}</div>
            </div>
            <div class="row">
              <div class="label"><b>Loose Quantity (in Kgs):</b></div>
              <div class="value">${taulaParchi.looseQuantity || 'N/A'}</div>
            </div>
            <div class="row">
              <div class="label"><b>Net Weight (Quintal):</b></div>
              <div class="value">${taulaParchi.netWeight}</div>
            </div>
            <div class="row">
              <div class="label"><b>Hammali (₹):</b></div>
              <div class="value">${taulaParchi.hammali}</div>
            </div>
            <div class="row">
              <div class="label"><b>Amount (₹):</b></div>
              <div class="value">${taulaParchi.amount || 'N/A'}</div>
            </div>
          </div>
          <div class="section">
              <div class="row"><div class="label"><b>QR Code:</b></div><div class="value"><img src="${this.qrCodeUrl}" alt="QR Code" /></div></div>
            </div>

          <!-- Print Button -->
          <button class="btn-print" onclick="window.print()">Print Receipt</button>
        </div>
      </div>
    </body>
  </html>
    `;

    // Open a new window and write the receipt content to it
    const newWindow = window.open('', '', 'width=800,height=600');
    newWindow!.document.write(receiptContent);
    newWindow!.document.close(); // Close document to enable further interaction

    // Auto-print the receipt
    newWindow!.print();
  }

  // Helper function to generate the Sr.No based on created_at timestamp
  getTaulaParchiSrNo(created_at: string): string {
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

  sendToPrintReceipt(taulaParchi: any) {
    this.apiService.put(`taulparchi/${taulaParchi._id}`, {
      enableToPrint: true,
      enableToPrintBy: this.authService?.currentUser?.email || 'N/A',
    }).subscribe({
      next: (res: any) => {
        console.log('Taula Parchi updated successfully:', res);
        alert('Sent to printer.');
        // this.printReceipt(taulaParchi);
      },
      error: (err: any) => {
        console.error('Error updating Taula Parchi:', err);
      },
    });
  }
}
