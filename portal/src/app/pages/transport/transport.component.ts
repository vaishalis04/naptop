import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-transport',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgxPaginationModule
  ],
  templateUrl: './transport.component.html',
  styleUrl: './transport.component.css'
})
export class TransportComponent {
  isEdit: 'Update' | 'Add' | undefined;
  data: any[] = [];
  masterToAddOrEdit: any = {};
  masterToAddOrEditIndex: number = -1;
  p: number = 1;
  limit: number = 10;
  total: number = 0;
  masterName: string = 'Transport';

  constructor(
    private apiService: ApiService
  ) {
    this.getData(); 
  }
  getData() {
    this.apiService.get('transport', {
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
    
    this.apiService.post('transport', this.masterToAddOrEdit).subscribe(
      (data: any) => {
        this.getData();
        this.resetMasterToAddOrEdit();
      },
    );
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
    if (confirm('Are you sure you want to update this Transport?')) {
      if (this.masterToAddOrEditIndex === -1) {
        return;
      }
      this.apiService.put(`transport/${this.masterToAddOrEdit._id}`, this.masterToAddOrEdit).subscribe((data: any) => {
        this.getData();
        this.resetMasterToAddOrEdit();
      });
    }
  }
  deleteItem(index: number) {
    if (confirm('Are you sure you want to delete this Transport?')) {
      this.apiService.delete(`transport/${this.data[index]._id}`).subscribe((data: any) => {
        this.getData();
      });
    }
  }
}
