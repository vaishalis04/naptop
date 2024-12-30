import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import ActivatedRoute
import { ApiService } from '../../services/api.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthService } from '../../services/auth.service';

declare const IminPrinter: any;

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


  printerStatus: any = '';
  loadingText: any = '';
  IminPrintInstance: any = '';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute, // Inject ActivatedRoute to capture route parameters
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get the ID from the route
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getTruckLoadingParchiById(id);
    }
    this.initPrinter()
  }

  async initPrinter() {
    // Initialize printer instance
    this.IminPrintInstance = new IminPrinter();

    // Connect to printer and check status
    try {
      const isConnect = await this.IminPrintInstance.connect();
      let reconnectNum = 0;

      if (isConnect) {
        this.loadingText = 'The connection is successful and is being initialized.';
        this.printerStatus = 'Connected, initializing...';

        this.IminPrintInstance.initPrinter();
        this.loadingText = 'Initialization successful, checking printing status.';

        const checkStatus = setInterval(async () => {
          const status = await this.IminPrintInstance.getPrinterStatus();
          if (status.value === 0) {
            this.loadingText = 'Printing status is normal.';
            this.printerStatus = 'Ready';
            clearInterval(checkStatus);
          } else if (status.value < 0) {
            reconnectNum++;
            this.printerStatus = 'Reconnecting... (Attempt ' + reconnectNum + ')';
            if (reconnectNum > 3) {
              reconnectNum = 0;
              this.IminPrintInstance.initPrinter();
            }
          } else {
            this.loadingText = `Error, printing status is abnormal, status value: ${status.value} trying to reconnect`;
            this.printerStatus = 'Error: Abnormal status';
          }
        }, 2000);
      } else {
        this.loadingText = 'Error, The print service cannot be connected';
        this.printerStatus = 'Connection failed';
      }
    } catch (error) {
      this.loadingText = 'Error, The print service cannot be connected';
      this.printerStatus = 'Connection error';
      console.error('Printer connection error:', error);
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
            <span>${this.truckLoadingParchi.sno}</span>
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
            <span><b>Dried Weight:</b></span>
            <span>${this.truckLoadingParchi?.driedWeight} Kgs</span>
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
  sendToPrintReceipt(truckLoadingParchi: any) {
    if (this.printerStatus == 'Ready') {
      this.printViaPrinter()
    } else {
      this.printReceipt();
    }
    // this.apiService.put(`truckloading/${truckLoadingParchi._id}`, {
    //   enableToPrint: true,
    //   enableToPrintBy: this.authService?.currentUser?.email || 'N/A',
    // }).subscribe({
    //   next: (res: any) => {
    //     console.log('Truck Loading Parchi updated:', res);
    //     alert('Sent to printer.');
    //     // this.printReceipt(taulaParchi);
    //   },
    //   error: (err: any) => {
    //     console.error('Error updating Truck Loading Parchi:', err);
    //   },
    // });
  }

  async printViaPrinter() {
    try {
      this.IminPrintInstance.setTextWidth(576);

      // Header
      this.IminPrintInstance.setTextSize(28);
      this.IminPrintInstance.setTextStyle(1);
      this.IminPrintInstance.printColumnsText(
        ['Truck Loading Parchi'],
        [32],
        [1],
        [28],
        576
      );
      this.IminPrintInstance.printColumnsText(
        ['M+M'],
        [32],
        [1],
        [28],
        576
      );
      this.IminPrintInstance.printText('========================');

      // Reset text style
      this.IminPrintInstance.setTextStyle(0);
      this.IminPrintInstance.setTextSize(24);

      // Basic Details
      this.IminPrintInstance.printColumnsText(
        ['Sr.No', this.truckLoadingParchi?.sno],
        [12, 20],
        [0, 2],
        [24, 24],
        576
      );

      this.IminPrintInstance.printColumnsText(
        ['Date', new Date(this.truckLoadingParchi?.created_at).toLocaleDateString()],
        [12, 20],
        [0, 2],
        [24, 24],
        576
      );

      this.IminPrintInstance.printColumnsText(
        ['Time', new Date(this.truckLoadingParchi?.created_at).toLocaleTimeString()],
        [12, 20],
        [0, 2],
        [24, 24],
        576
      );

      this.IminPrintInstance.printText('------------------');

      // Party Details Section
      this.IminPrintInstance.setTextStyle(1);
      this.IminPrintInstance.printText('Party Details:');
      this.IminPrintInstance.setTextStyle(0);

      this.IminPrintInstance.printColumnsText(
        ['Party Name', this.truckLoadingParchi.partyDetails?.name || 'N/A'],
        [15, 17],
        [0, 2],
        [24, 24],
        576
      );

      this.IminPrintInstance.printColumnsText(
        ['Truck', this.truckLoadingParchi.truckDetails?.truckNumber || 'N/A'],
        [15, 17],
        [0, 2],
        [24, 24],
        576
      );

      this.IminPrintInstance.printColumnsText(
        ['Transport', this.truckLoadingParchi.transportDetails?.name || 'N/A'],
        [15, 17],
        [0, 2],
        [24, 24],
        576
      );

      this.IminPrintInstance.printText('------------------');

      // Location Details Section
      this.IminPrintInstance.setTextStyle(1);
      this.IminPrintInstance.printText('Location Details:');
      this.IminPrintInstance.setTextStyle(0);

      this.IminPrintInstance.printColumnsText(
        ['Storage', this.truckLoadingParchi.wearhouseDetails?.name || 'N/A'],
        [15, 17],
        [0, 2],
        [24, 24],
        576
      );

      this.IminPrintInstance.printColumnsText(
        ['Delivery', this.truckLoadingParchi.deliveryDetails?.name || 'N/A'],
        [15, 17],
        [0, 2],
        [24, 24],
        576
      );

      this.IminPrintInstance.printColumnsText(
        ['Hammal', this.truckLoadingParchi.hammalDetails?.name || 'N/A'],
        [15, 17],
        [0, 2],
        [24, 24],
        576
      );

      this.IminPrintInstance.printText('------------------');

      // Weight Details Section
      this.IminPrintInstance.setTextStyle(1);
      this.IminPrintInstance.printText('Weight Details:');
      this.IminPrintInstance.setTextStyle(0);

      const details = [
        ['Bora Qty', this.truckLoadingParchi.boraQuantity || 'N/A'],
        ['Unit Bora', `${this.truckLoadingParchi.unitBora || 'N/A'}Kg`],
        ['Bardana', this.truckLoadingParchi.bardanaType == 1000 ? '1 Kg' :
          (this.truckLoadingParchi.bardanaType == 650 ? '0.650 Kg' : 'No Bardana Weight')],
        ['Dried Weight', `${this.truckLoadingParchi.driedWeight || 'N/A'} Kgs`],
        ['Net Weight', `${this.truckLoadingParchi.netWeight || 'N/A'} Quintal`]
      ];

      details.forEach(([label, value]) => {
        this.IminPrintInstance.printColumnsText(
          [label, value],
          [15, 17],
          [0, 2],
          [24, 24],
          576
        );
      });

      this.IminPrintInstance.printText('------------------');

      // Payment Details Section with larger and bold text
      this.IminPrintInstance.setTextStyle(1);
      this.IminPrintInstance.setTextSize(26);
      this.IminPrintInstance.printColumnsText(
        ['Rate', `₹${this.truckLoadingParchi.rate || 'N/A'}`],
        [15, 17],
        [0, 2],
        [26, 26],
        576
      );

      this.IminPrintInstance.printColumnsText(
        ['Advance', `₹${this.truckLoadingParchi.advance || 'N/A'}`],
        [15, 17],
        [0, 2],
        [26, 26],
        576
      );

      // Remark if exists
      if (this.truckLoadingParchi.other) {
        this.IminPrintInstance.printText('------------------');
        this.IminPrintInstance.setTextStyle(1);
        this.IminPrintInstance.printText('Remark:');
        this.IminPrintInstance.setTextStyle(0);
        this.IminPrintInstance.printText(this.truckLoadingParchi.other);
      }

      this.IminPrintInstance.printText('------------------');

      // Footer
      this.IminPrintInstance.printColumnsText(
        ['Thank You!'],
        [32],
        [1],
        [24],
        576
      );
      this.IminPrintInstance.printText('========================');

      // Feed and Cut
      this.IminPrintInstance.printAndFeedPaper(100);
      this.IminPrintInstance.partialCut();

      alert('Receipt printed successfully');
    } catch (error) {
      console.error('Error printing receipt:', error);
      alert('Print error occurred');
      this.printReceipt();
    }
}
}
