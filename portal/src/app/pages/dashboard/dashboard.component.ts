import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthService } from '../../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    CommonModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  currentDate = new Date();
  TaulaParchiCount = 0;
  TruckLoadingParchiCount = 0;
  TaulaParchi: any[] = [];
  TruckLoadingParchi: any[] = [];
  pageForTaulaParchi = 1;
  pageForTruckLoadingParchi = 1;
  warehouses: any[] = [];
  currentUser: any;
  crops: any[] = [];
  storages: any[] = [];
  farmerNameSearch = '';
  farmerMobileSearch = '';
  farmerVillageSearch = '';
  snoSearch='';
  transactionTypeSearch='';
  selectedWarehouse: any;
  selectedCrop: any;
  qrCodeUrl: string | null = null;
  location: any[] = [];
  selectedWarehouseId:any;
  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.getTaulaParchis();
    this.getTruckLoadingParchis();
    this.getWarehouses('daily');
    this.getCrops();
    this.loadWarehouses()
  }

  getCrops() {
    this.apiService
      .get('crop', {
        params: {
          page: 1,
          limit: 1000,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.crops = res.data;
        },
        error: (err: any) => {
          console.error('Error fetching crops:', err);
        },
      });
  }

  // Fetch TaulaParchis from backend
  getTaulaParchis() {
    const query: any = {};
    if (this.farmerNameSearch) {
      query['farmerName'] = this.farmerNameSearch;
    }
    if (this.farmerMobileSearch) {
      query['farmerMobile'] = this.farmerMobileSearch;
    }
    if (this.farmerVillageSearch) {
      query['farmerVillage'] = this.farmerVillageSearch;
    }
    if (this.snoSearch) {
      query['sno'] = this.snoSearch;
    }
    if (this.selectedWarehouse) {
      query['warehouse'] = this.selectedWarehouse;
    }
    if (this.selectedCrop) {
      query['crop'] = this.selectedCrop;
    }
    if (this.transactionTypeSearch) {
      query['transactionType'] = this.transactionTypeSearch;
    }
    this.apiService
      .get('taulparchi', {
        params: {
          page: this.pageForTaulaParchi,
          limit: 10,
          ...query,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.TaulaParchi = res.data;
          this.TaulaParchiCount = res.total || this.TaulaParchi.length;
        },
        error: (err: any) => {
          console.error('Error fetching TaulaParchis:', err);
        },
      });
  }

  // Fetch TruckLoadingParchis from backend
  getTruckLoadingParchis() {
    this.apiService
      .get('truckloading', {
        params: {
          page: this.pageForTruckLoadingParchi,
          limit: 10,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.TruckLoadingParchi = res.data;
          console.log('loading...', res.data);
          this.TruckLoadingParchiCount =
            res.total || this.TruckLoadingParchi.length;
        },
        error: (err: any) => {
          console.error('Error fetching TruckLoadingParchis:', err);
        },
      });
  }

  getWarehouses(timeframe?: any) {
    // get storage locations
    this.apiService.get('storage', {
      params: {
        page: 1,
        limit: 1000
      },
    }).subscribe({
      next: (res: any) => {
        this.warehouses = Object.values(res.data);
        const query: any = {};
        if (timeframe !== 'overall') {
          query['timeframe'] = timeframe;
        }
        for (const warehouse of this.warehouses) {
          this.apiService.get(`stock/warehouse-stock-crop-wise`, {
            params: {
              warehouse: warehouse._id,
              ...query,
            },
          }).subscribe({
            next: (res: any) => {
              this.warehouses = this.warehouses.map((w) => {
                if (w._id === warehouse._id) {
                  w.stock = res;
                }
                return w;
              });
              console.log(this.warehouses);
            },
            error: (err: any) => {
              console.error('Error fetching warehouse stock:', err);
            },
          });
        }
      },
      error: (err: any) => {
        console.error('Error fetching warehouses:', err);
      },
    });
  }
  loadWarehouses() {
    this.apiService.get('storage').subscribe({
      next: (data: any) => {
        this.location = data.data;
        console.log(this.location,"gvshgvh")
      },
      error: (error: any) => {
        console.error('Error fetching warehouses:', error);
      },
    });
  }
  onWarehouseChange() {
    const selectedWarehouse = this.location.find(
      (warehouse) => warehouse._id === this.selectedWarehouseId
    );

    if (selectedWarehouse) {
      localStorage.setItem('selectedWarehouseId', selectedWarehouse._id);
      localStorage.setItem('selectedWarehouse', JSON.stringify(selectedWarehouse));
    }
  }

  getSelectedWarehouse() {
    const selectedWarehouse = localStorage.getItem('selectedWarehouse');
    return selectedWarehouse ? JSON.parse(selectedWarehouse) : null;
  }
  getSelectedWarehouseId() {
    return localStorage.getItem('selectedWarehouseId');
  }

  
  getCurrentUser() {
    return this.authService.currentUser;
  }
  generateQRCode(data: string) {
    this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${data}&size=150x150`;
  }
  printReceipt(taulaParchi: any) {
    this.generateQRCode(taulaParchi._id || 'N/A');
    const receiptContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Taula Parchi Receipt</title>
          <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet" />
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
            h4 { text-align: center; }
            .section { margin-bottom: 15px; padding-bottom: 10px; }
            .row { display: flex; justify-content: space-between; }
            .btn-print { display: block; margin: 20px auto; }
            @media print { .btn-print { display: none; } }
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
              <div class="value">${taulaParchi?.sno}</div>
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
              <div class="value">${taulaParchi.farmerName || 'N/A'}</div>
            </div>
            <div class="row">
              <div class="label"><b>Mobile:</b></div>
              <div class="value">${taulaParchi.farmerMobile || 'N/A'}</div>
            </div>
            <div class="row">
              <div class="label"><b>Village:</b></div>
              <div class="value">${taulaParchi.farmerVillage || 'N/A'}</div>
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
            <div class="row">
              <div class="label"><b>Transaction Type:</b></div>
              <div class="value">${taulaParchi.transactionType || 'N/A'}</div>
            </div>
            <div class="row">
              <div class="label"><b>Transaction Id:</b></div>
              <div class="value">${taulaParchi.transactionId || 'N/A'}</div>
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
      </html>`;

    const receiptWindow = window.open('', '_blank');
    receiptWindow?.document.write(receiptContent);
    receiptWindow?.document.close();
    receiptWindow?.focus();
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
