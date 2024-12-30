import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import ActivatedRoute
import { ApiService } from '../../services/api.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { QRCodeModule } from 'angularx-qrcode';
import { AuthService } from '../../services/auth.service';

declare const IminPrinter: any;

@Component({
  selector: 'app-taulparchi-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    NgxPaginationModule,
    QRCodeModule
  ],
  templateUrl: './taulparchi-view.component.html',
  styleUrl: './taulparchi-view.component.css',
})
export class TaulparchiViewComponent implements OnInit {
  taulaParchi: any = {}; // Store the specific taulaParchi details here
  qrCodeUrl: string | null = null;
  printerStatus: any = '';
  loadingText: any = '';
  IminPrintInstance: any = '';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute, // Inject ActivatedRoute to capture route parameters
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Get the ID from the route
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getTaulaParchiById(id);
    }
    this.initPrinter()
  }

  // Fetch Taula Parchi by ID
  getTaulaParchiById(id: string) {
    this.apiService.get(`taulparchi/${id}`).subscribe({
      next: (res: any) => {
        console.log("res", res)
        this.taulaParchi = res;
        console.log("taulparchi", res)
      },
      error: (err: any) => {
        console.error('Error fetching Taula Parchi details:', err);
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
              <div class="value">${taulaParchi.exemptHammali ? (taulaParchi.exemptHammali === 'deduct' ? 'Deduct' : 'Exempted') : 'N/A'
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
              <div class="value">${taulaParchi.netWeight || 'N/A'}</div>
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

  /**
   * <!-- SRNO. TL{DD}{MM}{YY}{HH}{MM}{SS} -->
            <b>Sr.no:</b> {{ getTaulaParchiSrNo(taulaParchi?.created_at) }}
   */
  getTaulaParchiSrNo(created_at: string): string {
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
    this.router.navigate(['/taul-parchi-dashboard']); // Adjust the route as needed
  }
  sendToPrintReceipt(taulaParchi: any) {
    if (this.printerStatus == 'Ready') {
      this.printViaPrinter()
    } else {
      this.printReceipt(this.taulaParchi);
    }
    // this.apiService.put(`taulparchi/${taulaParchi._id}`, {
    //   enableToPrint: true,
    //   enableToPrintBy: this.authService?.currentUser?.email || 'N/A',
    // }).subscribe({
    //   next: (res: any) => {
    //     console.log('Taula Parchi updated successfully:', res);
    //     alert('Sent to printer.');
    //     // this.printReceipt(taulaParchi);
    //   },
    //   error: (err: any) => {
    //     console.error('Error updating Taula Parchi:', err);
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
        ['Taula Parchi Receipt'],
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
        ['Sr.No', this.taulaParchi?.sno],
        [12, 20],
        [0, 2],
        [24, 24],
        576
      );

      this.IminPrintInstance.printColumnsText(
        ['Date', new Date(this.taulaParchi?.created_at).toLocaleDateString()],
        [12, 20],
        [0, 2],
        [24, 24],
        576
      );

      this.IminPrintInstance.printColumnsText(
        ['Time', new Date(this.taulaParchi?.created_at).toLocaleTimeString()],
        [12, 20],
        [0, 2],
        [24, 24],
        576
      );

      this.IminPrintInstance.printText('------------------');

      // Farmer Details Section
      this.IminPrintInstance.setTextStyle(1);
      this.IminPrintInstance.printText('Farmer Details:');
      this.IminPrintInstance.setTextStyle(0);

      this.IminPrintInstance.printColumnsText(
        ["Farmer's Name", this.taulaParchi.farmerName || 'N/A'],
        [15, 17],
        [0, 2],
        [24, 24],
        576
      );

      this.IminPrintInstance.printColumnsText(
        ['Mobile', this.taulaParchi.farmerMobile || 'N/A'],
        [15, 17],
        [0, 2],
        [24, 24],
        576
      );

      this.IminPrintInstance.printColumnsText(
        ['Village', this.taulaParchi.farmerVillage || 'N/A'],
        [15, 17],
        [0, 2],
        [24, 24],
        576
      );

      this.IminPrintInstance.printColumnsText(
        ['Storage', this.taulaParchi.wearhouseDetails?.name || 'N/A'],
        [15, 17],
        [0, 2],
        [24, 24],
        576
      );

      this.IminPrintInstance.printColumnsText(
        ['Crop', this.taulaParchi.cropDetails?.name || 'N/A'],
        [15, 17],
        [0, 2],
        [24, 24],
        576
      );

      this.IminPrintInstance.printText('------------------');

      // Purchase Details Section
      this.IminPrintInstance.setTextStyle(1);
      this.IminPrintInstance.printText('Purchase Details:');
      this.IminPrintInstance.setTextStyle(0);

      this.IminPrintInstance.printColumnsText(
        ['Purchase', this.taulaParchi.purchase || 'N/A'],
        [15, 17],
        [0, 2],
        [24, 24],
        576
      );

      this.IminPrintInstance.printColumnsText(
        ['Company', this.taulaParchi.companyDetails?.name || 'N/A'],
        [15, 17],
        [0, 2],
        [24, 24],
        576
      );

      this.IminPrintInstance.printText('------------------');

      // Weight & Amount Details Section
      this.IminPrintInstance.setTextStyle(1);
      this.IminPrintInstance.printText('Weight & Amount Details:');
      this.IminPrintInstance.setTextStyle(0);

      const details = [
        ['Rate', `₹${this.taulaParchi.rate || 'N/A'}`],
        ['Tulai Option', this.taulaParchi.tulai || 'N/A'],
        ['Exempt Hammali', this.taulaParchi.exemptHammali ?
          (this.taulaParchi.exemptHammali === 'deduct' ? 'Deduct' : 'Exempted') : 'N/A'],
        ['Hammal', this.taulaParchi?.hammalDetails?.name || 'N/A'],
        ['Bora Qty', this.taulaParchi.boraQuantity || 'N/A'],
        ['Bharti', `${this.taulaParchi.bharti || 'N/A'} Kgs`],
        ['Loose Qty', `${this.taulaParchi.looseQuantity || 'N/A'} Kgs`],
        ['Net Weight', `${this.taulaParchi.netWeight || 'N/A'} Quintal`]
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

      // Total Section with larger and bold text
      this.IminPrintInstance.setTextStyle(1);
      this.IminPrintInstance.setTextSize(26);
      this.IminPrintInstance.printColumnsText(
        ['Hammali', `₹${this.taulaParchi.hammali || 'N/A'}`],
        [15, 17],
        [0, 2],
        [26, 26],
        576
      );

      this.IminPrintInstance.printColumnsText(
        ['Total Amount', `₹${this.taulaParchi.amount || 'N/A'}`],
        [15, 17],
        [0, 2],
        [26, 26],
        576
      );

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
      this.printReceipt(this.taulaParchi);
    }
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

  // Setup demo print functionality
  // setupPrintDemo() {
  //   const printButton: any = document.getElementById('printDemo');
  //   printButton.addEventListener('click', async function () {
  //     try {
  //       this.printerStatus = 'Printing demo receipt...';

  //       // Set text size for demo
  //       IminPrintInstance.setTextSize(28);

  //       // Print header
  //       IminPrintInstance.printText('===== Demo Print =====\n');

  //       // Print current date and time
  //       IminPrintInstance.printText(`Date: ${new Date().toLocaleString()}\n`);

  //       // Print test content
  //       IminPrintInstance.printText('This is a test print from\n');
  //       IminPrintInstance.printText('iMin Printer\n');

  //       // Print divider
  //       IminPrintInstance.printText('=====================\n');

  //       // Feed paper and cut
  //       IminPrintInstance.printAndFeedPaper(100);
  //       IminPrintInstance.partialCut();

  //       this.printerStatus = 'Demo receipt printed successfully';
  //     } catch (error) {
  //       this.printerStatus = 'Print error occurred';
  //       console.error('Print error:', error);
  //     }
  //   });
  // }
}
