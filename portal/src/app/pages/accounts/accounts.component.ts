import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

interface Transaction {
  date: Date;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    NgxPaginationModule,
  ],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
})
export class AccountsComponent implements OnInit {
  TaulaParchi: any[] = [];
  TaulaParchiCount = 0;
  TruckLoadingParchi: any[] = [];
  TruckLoadingParchiCount = 0;
  currentPage = 1; // Default page
  perPage = 5; // Items per page
  totalItems = 0;
  fromDate: any;
  toDate: any;
  TruckLoadingParchiTransactionSummary: any[] = [];
  TaulParchiTransactionSummary: any[] = [];
  Crops: any[] = [];
  selectedCrop:any
  tabState: 'truckloading' | 'taulparchi' = 'taulparchi';

  constructor(private apiService: ApiService) {} 

  ngOnInit(): void {
    this.setTabState('taulparchi');
    this.fetchCrops()
  }
  setTabState(newtabstate: 'truckloading' | 'taulparchi') {
    this.tabState = newtabstate;
    this.currentPage = 1;
    if (this.tabState == 'truckloading') {
      this.getTruckLoadingParchis();
      this.getTruckLoadingParchisTransactionSummary();
    } else if (this.tabState == 'taulparchi') {
      this.getTaulaParchis();
      this.getTaulParchisTransactionSummary();
    }
  }

  getTaulaParchis() {
    let params:any={
      page: this.currentPage,
      limit: this.perPage,
      // crop:this.selectedCrop
    };
    if(this.selectedCrop){
      params.crop=this.selectedCrop
    }
    this.apiService
      .get('taulparchi', {
        params
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
  getTruckLoadingParchis() {
    let params:any={
      page: this.currentPage,
      limit: this.perPage,
      // crop:this.selectedCrop
    };
    if(this.selectedCrop){
      params.crop=this.selectedCrop
    }
    this.apiService
      .get('truckloading', {
        params
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
  getTruckLoadingParchisTransactionSummary() {
    let params:any ={}
    if(this.selectedCrop){
      params.crop=this.selectedCrop
    }
    if(this.fromDate){
      params.fromDate=this.fromDate
    }
    if(this.toDate){
      params.toDate=this.toDate
    }
    this.apiService
      .get('truckloading/getsummary', {
        params
      })
      .subscribe({
        next: (res: any) => {
          this.TruckLoadingParchiTransactionSummary = res.data;
        },
        error: (err: any) => {
          console.error('Error fetching TruckLoadingParchis:', err);
        },
      });
  }
  getTaulParchisTransactionSummary() {
    let params:any ={}
    if(this.selectedCrop){
      params.crop=this.selectedCrop
    }
    if(this.fromDate){
      params.fromDate=this.fromDate
    }
    if(this.toDate){
      params.toDate=this.toDate
    }
    this.apiService
      .get('taulparchi/getsummary', {
        params
      })
      .subscribe({
        next: (res: any) => {
          this.TaulParchiTransactionSummary = res.data;
        },
        error: (err: any) => {
          console.error('Error fetching TaulParchis:', err);
        },
      });
  }
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
  // printReceipt(transaction: any, type: 'taulparchi' | 'truckloading') {
  //   let receiptContent = '';
    
  //   if (type === 'taulparchi') {
  //     receiptContent = `
  //       <h1>Taul Parchi Receipt</h1>
  //       <p><strong>Date:</strong> ${new Date(transaction.created_at).toLocaleDateString()}</p>
  //       <p><strong>Farmer:</strong> ${transaction.farmerDetails.name}</p>
  //       <p><strong>Village:</strong> ${transaction.villageDetails.name}</p>
  //       <p><strong>Firm/Company:</strong> ${transaction.firm_company}</p>
  //       <p><strong>Rate:</strong> ₹${transaction.rate}</p>
  //       <p><strong>Hammal:</strong> ${transaction.hammalDetails.name}</p>
  //       <p><strong>Crop:</strong> ${transaction.cropDetails.name}</p>
  //     `;
  //   } else if (type === 'truckloading') {
  //     receiptContent = `
  //       <h1>Truck Loading Parchi Receipt</h1>
  //       <p><strong>Date:</strong> ${new Date(transaction.created_at).toLocaleDateString()}</p>
  //       <p><strong>Party Name:</strong> ${transaction.partyDetails.name}</p>
  //       <p><strong>Vehicle Number:</strong> ${transaction.vehicleNumber}</p>
  //       <p><strong>Delivery Location:</strong> ${transaction.deliveryDetails.name}</p>
  //       <p><strong>Hammal:</strong> ${transaction.hammalDetails.name}</p>
  //       <p><strong>Bora Nag:</strong> ${transaction.boraQuantity}</p>
  //       <p><strong>Kaanta Weight:</strong> ${transaction.netWeight}</p>
  //       <p><strong>Crop:</strong> ${transaction.cropDetails.name}</p>
  //       <p><strong>Rate:</strong> ₹${transaction.rate}</p>
  //       <p><strong>Other:</strong> ${transaction.other}</p>
  //     `;
  //   }
    
  //   const printWindow:any = window.open('', '_blank');
  //   printWindow.document.write(`
  //     <html>
  //       <head>
  //         <title>Receipt</title>
  //         <style>
  //           body { font-family: Arial, sans-serif; }
  //           h1 { text-align: center; }
  //           p { font-size: 14px; }
  //         </style>
  //       </head>
  //       <body>
  //         ${receiptContent}
  //         <script>
  //           window.onload = function() {
  //             window.print();
  //             window.close();
  //           }
  //         </script>
  //       </body>
  //     </html>
  //   `);
  //   printWindow.document.close();
  // }
  printReceipt(transaction: any, type: 'taulparchi' | 'truckloading') {
    let receiptContent = '';

    if (type === 'taulparchi') {
        receiptContent = `
            <div style="text-align: center; color: #333;">
                <h1 style="color: #007bff;">Taul Parchi Receipt</h1>
                <p><strong>Date:</strong> ${new Date(transaction.created_at).toLocaleDateString()}</p>
                <p><strong>Farmer:</strong> ${transaction.farmerDetails.name}</p>
                <p><strong>Village:</strong> ${transaction.villageDetails.name}</p>
                <p><strong>Firm/Company:</strong> ${transaction.firm_company}</p>
                <p style="font-size: 1.2em; color: #28a745;"><strong>Rate:</strong> ₹${transaction.rate}</p>
                <p><strong>Hammal:</strong> ${transaction.hammalDetails.name}</p>
                <p><strong>Crop:</strong> ${transaction.cropDetails.name}</p>
            </div>
        `;
    } else if (type === 'truckloading') {
        receiptContent = `
            <div style="text-align: center; color: #333;">
                <h1 style="color: #007bff;">Truck Loading Parchi Receipt</h1>
                <p><strong>Date:</strong> ${new Date(transaction.created_at).toLocaleDateString()}</p>
                <p><strong>Party Name:</strong> ${transaction.partyDetails.name}</p>
                <p><strong>Vehicle Number:</strong> ${transaction.vehicleNumber}</p>
                <p><strong>Delivery Location:</strong> ${transaction.deliveryDetails.name}</p>
                <p><strong>Hammal:</strong> ${transaction.hammalDetails.name}</p>
                <p style="color: #dc3545;"><strong>Bora Nag:</strong> ${transaction.boraQuantity}</p>
                <p><strong>Kaanta Weight:</strong> ${transaction.netWeight}</p>
                <p><strong>Crop:</strong> ${transaction.cropDetails.name}</p>
                <p style="font-size: 1.2em; color: #28a745;"><strong>Rate:</strong> ₹${transaction.rate}</p>
                <p><strong>Other:</strong> ${transaction.other}</p>
            </div>
        `;
    }

    const printWindow: any = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Receipt</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                    h1 { text-align: center; }
                    p { font-size: 14px; margin: 5px 0; }
                    .header { background-color: #007bff; color: white; padding: 10px; }
                    .footer { margin-top: 20px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Receipt</h1>
                </div>
                ${receiptContent}
                <div class="footer">
                    <p>Thank you for your business!</p>
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                        window.close();
                    }
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

}
