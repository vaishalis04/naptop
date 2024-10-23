import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';

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

  constructor(private apiService: ApiService) {
    this.getTaulaParchis();
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

  printReceipt(taulaParchi: any) {
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
        text-align: center;
        margin-bottom: 15px;
        padding-bottom: 10px;
      }

      .section-title {
        font-weight: bold;
        margin-bottom: 10px;
        text-align: center;
      }

      .section p {
        margin: 0;
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
    </style>
  </head>
  <body>
    <div class="container mt-4">
      <div class="card">
        <h4 class="mb-4">Taula Parchi Receipt</h4>

        <!-- Sr. No and Date Section -->
        <div class="section">
          <p><strong>Sr.No:</strong> ${taulaParchi._id}</p>
          <p><strong>Date:</strong> ${new Date(
            taulaParchi.created_at
          ).toLocaleDateString()}</p>
        </div>

        <!-- Farmer and Crop Details -->
        <div class="section">
          <p><strong>Farmer's Name:</strong> ${
            taulaParchi.farmerDetails.name
          }</p>
          <p><strong>Village:</strong> ${taulaParchi.farmerDetails.village}</p>
          <p><strong>Mobile:</strong> ${taulaParchi.farmerDetails.mobile}</p>
          <p><strong>Storage Location:</strong> ${
            taulaParchi.wearhouseDetails.name
          }</p>
          <p><strong>Crop:</strong> ${taulaParchi.cropDetails.name}</p>
        </div>

        <!-- Purchase and Firm Details -->
        <div class="section">
          <p><strong>Purchase Status:</strong> ${taulaParchi.purchase}</p>
          <p><strong>Firm/Company:</strong> ${taulaParchi.firm_company}</p>
        </div>

        <!-- Additional Fields -->
        <div class="section">
          <p><strong>Rate:</strong> ${taulaParchi.rate}</p>
          <p><strong>Hammal:</strong> ${taulaParchi.hammal}</p>
          <p><strong>Bora Quantity:</strong> ${taulaParchi.boraQuantity}</p>
          <p><strong>Bharti:</strong> ${taulaParchi.bharti}</p>
          <p><strong>Loose Quantity:</strong> ${taulaParchi.looseQuantity}</p>
          <p><strong>Net Weight:</strong> ${taulaParchi.netWeight}</p>
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
}
