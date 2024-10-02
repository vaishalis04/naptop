import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transactionlist',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    NgxPaginationModule,
  ],
  templateUrl: './transactionlist.component.html',
  styleUrl: './transactionlist.component.css',
})
export class TransactionlistComponent {
  transactions: any[] = [];
  transactionsCount = 0;
  fromDate: any;
  toDate: any;

  constructor(private apiService: ApiService,private router: Router) {}

  
  ngOnInit(): void {
    this.getTransactions();
  
  }

  getTransactions() {
    let params;
   
    this.apiService
      .get('transaction', {
         params
      })
      .subscribe({
        next: (res: any) => {
          this.transactions = res;
          this.transactionsCount = res.meta.total || this.transactions.length;
          console.log("vasv",res)
        },
        error: (err: any) => {
          console.error('Error fetching transactions:', err);
        },
      });
  }
  
  navigateToTransactionPage() {
    this.router.navigate(['/transaction']); // Adjust the path as needed
  }
}
