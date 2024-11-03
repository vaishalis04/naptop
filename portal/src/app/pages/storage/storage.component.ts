import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ApiService } from '../../services/api.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-storage',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgxPaginationModule,
    RouterModule
  ],
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.css'
})
export class StorageComponent {
  isEdit: 'Update' | 'Add' | undefined;

  data: any[] = [];


  masterToAddOrEdit: any = {};
  masterToAddOrEditIndex: number = -1;
  p: number = 1;
  limit: number = 10;
  total: number = 0;
  masterName: string = 'Storage Location';

  selectedWarehouseId: any;
  stockData: any[] = [];

  stockItemToAddOrEdit: {
    crop: string;
    quantity: number;
    warehouse: string;
    price: number;
    logType: string;
    bag_units: { unit_weight_of_bags: number; no_of_bags: number }[];
    meta_data: any;
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

  crops: any[] = [];

  constructor(
    private apiService: ApiService
  ) {
    this.getData();
  }
  getData() {
    this.apiService.get('storage', {
      params: {
        page: this.p,
        limit: this.limit
      }
    }).subscribe((data: any) => {
      this.data = data.data;
      this.total = data.meta.total;
      this.p = data.meta.current_page;
      this.limit = data.meta.per_page;
    });
  }

  getCrops() {
    this.apiService.get('crop', {
      params: {
        page: 1,
        limit: 100
      }
    }).subscribe((data: any) => {
      this.crops = data.data;
    });
  }

  selectItemToEdit(index: number) {
    // this.masterToAddOrEdit = this.data[index];
    this.masterToAddOrEdit = Object.assign({}, this.data[index]);
    this.masterToAddOrEditIndex = index
    this.isEdit = 'Update';
  }

  selectItemToAdd() {
    this.masterToAddOrEdit = {};
    this.isEdit = 'Add';
  }
  addNewItem() {
    if (this.masterToAddOrEdit.name === '') {
      return;
    }
    this.apiService.post('storage', this.masterToAddOrEdit).subscribe((data: any) => {
      this.getData();
      this.resetMasterToAddOrEdit();
    });
  }
  resetMasterToAddOrEdit() {
    this.masterToAddOrEdit = {};
    this.masterToAddOrEditIndex = -1;
    this.isEdit = undefined;
  }
  editItem(index: number) {
    if (this.masterToAddOrEditIndex === -1) {
      return;
    }
    if (this.masterToAddOrEdit.name === '') {
      return;
    }
    if (confirm('Are you sure you want to update this storage?')) {
      if (this.masterToAddOrEditIndex === -1) {
        return;
      }
      this.apiService.put(`storage/${this.masterToAddOrEdit._id}`, this.masterToAddOrEdit).subscribe((data: any) => {
        this.getData();
        this.resetMasterToAddOrEdit();
      });
    }
  }
  deleteItem(index: number) {
    if (confirm('Are you sure you want to delete this storage?')) {
      this.apiService.delete(`storage/${this.data[index]._id}`).subscribe((data: any) => {
        this.getData();
      });
    }
  }

  getSelectedWarehouse() {
    return this.data.find((item: any) => item._id === this.selectedWarehouseId);
  }

  viewStock(warehouseId: string) {
    if (warehouseId) {
      this.selectedWarehouseId = warehouseId;
      this.apiService.get(`stock/warehouse-stock-crop-wise`, {
        params: {
          warehouse: warehouseId,
        },
      }).subscribe({
        next: (res: any) => {
          this.stockData = res;
          this.getCrops();
        },
        error: (err: any) => {
          console.error('Error fetching stock:', err);
        },
      });
    }
  }

  exportToExcel() {
    // export to CSV
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Sr No.,Crop Name,Quantity,Average Price\n';
    this.stockData.forEach((item: any, index: number) => {
      csvContent += `${index + 1},${item.crop},${item.quantity},${item.averagePrice}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'stock.csv');
    document.body.appendChild(link);
    link.click();
  }

  selectStockItemToAdd() {
    this.stockItemToAddOrEdit = {
      crop: '',
      quantity: 0,
      warehouse: this.selectedWarehouseId,
      price: 0,
      logType: '',
      meta_data: {},
      bag_units: [],
    };
    this.isStockUpdateModelOpen = true;
  }

  updateStock() {
    if (this.stockItemToAddOrEdit.crop === '') {
      return;
    }
    this.apiService.post('stock', this.stockItemToAddOrEdit).subscribe((data: any) => {
      this.viewStock(this.selectedWarehouseId);
      this.isStockUpdateModelOpen = false;
    });
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
