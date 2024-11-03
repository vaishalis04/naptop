import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-stock-view',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, NgxPaginationModule, RouterModule],
  templateUrl: './stock-view.component.html',
  styleUrl: './stock-view.component.css'
})
export class StockViewComponent {

  crop_id: any;
  warehouse_id: any;

  // crops: any[] = [];

  stock_data: Array<any> = [];

  page = 1;
  limit = 10;
  total = 0;

  stockItemToAddOrEdit: {
    _id?: string;
    crop: string;
    quantity: number;
    warehouse: string;
    price: number;
    logType: string;
    bag_units: { unit_weight_of_bags: number; no_of_bags: number }[];
    meta_data: any;
    created_at?: Date;
    updated_at?: Date;
  } = {
    crop: '',
    quantity: 0,
    warehouse: '',
    price: 0,
    logType: '',
    bag_units : [],
    meta_data: {},
  };
  isStockUpdateModelOpen: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.crop_id = params['crop_id'];
      this.warehouse_id = params['warehouse_id'];
      this.getStockData();
    });
  }

  getStockData() {
    this.apiService.get(`stock`, {
      params: {
        page: this.page,
        limit: this.limit,
        crop: this.crop_id,
        warehouse: this.warehouse_id,
      }
    }).subscribe({
      next: (res: any) => {
        this.stock_data = res.data;
        this.total = res.meta.total
      },
      error: (err: any) => {
        console.error('Error fetching stock data:', err);
      },
    });
  }

  // getCrops() {
  //   this.apiService.get('crop', {
  //     params: {
  //       page: 1,
  //       limit: 1000,
  //     }
  //   }).subscribe({
  //     next: (res: any) => {
  //       this.crops = res;
  //     },
  //     error: (err: any) => {
  //       console.error('Error fetching crops:', err);
  //     },
  //   });
  // }

  openStockUpdateModel(stockItem: any) {
    this.isStockUpdateModelOpen = true;
    this.stockItemToAddOrEdit = stockItem;
  }

  closeStockUpdateModel() {
    this.isStockUpdateModelOpen = false;
    this.stockItemToAddOrEdit = {
      crop: '',
      quantity: 0,
      warehouse: '',
      price: 0,
      logType: '',
      bag_units : [],
      meta_data: {},
    };
  }

  saveStockItem() {
    if (this.stockItemToAddOrEdit._id) {
      this.apiService.put(`stock/${this.stockItemToAddOrEdit._id}`, this.stockItemToAddOrEdit).subscribe({
        next: (res: any) => {
          this.getStockData();
          this.closeStockUpdateModel();
        },
        error: (err: any) => {
          console.error('Error updating stock item:', err);
        },
      });
    } else {
      this.apiService.post('stock', this.stockItemToAddOrEdit).subscribe({
        next: (res: any) => {
          this.getStockData();
          this.closeStockUpdateModel();
        },
        error: (err: any) => {
          console.error('Error adding stock item:', err);
        },
      });
    }
  }

  addBags() {
    const noOfBags = document.getElementById('no_of_bags') as HTMLInputElement;
    const bagWeightInKgs = document.getElementById('unit_weight_of_bags') as HTMLInputElement;
    if (noOfBags && bagWeightInKgs) {
      this.stockItemToAddOrEdit.bag_units.push({
        unit_weight_of_bags: parseFloat(bagWeightInKgs.value),
        no_of_bags: parseInt(noOfBags.value)
      });
      this.stockItemToAddOrEdit.quantity = this.stockItemToAddOrEdit.bag_units.reduce((acc: number, bag: any) => {
        return acc + ((bag.unit_weight_of_bags * bag.no_of_bags) / 100);
      }, 0);
    }
  }

  removeBag(index: number) {
    this.stockItemToAddOrEdit.bag_units.splice(index, 1);
    this.stockItemToAddOrEdit.quantity = this.stockItemToAddOrEdit.bag_units.reduce((acc: number, bag: any) => {
      return acc + ((bag.unit_weight_of_bags * bag.no_of_bags) / 100);
    }, 0);
  }

}
