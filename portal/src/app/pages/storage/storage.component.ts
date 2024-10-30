import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-storage',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgxPaginationModule
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
}
