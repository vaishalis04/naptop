import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-farmers',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgxPaginationModule
  ],
  templateUrl: './farmers.component.html',
  styleUrl: './farmers.component.css'
})
export class FarmersComponent {

  isEdit: 'Update' | 'Add' | undefined;
  data: any[] = [];
  masterToAddOrEdit: any = {};
  masterToAddOrEditIndex: number = -1;
  p: number = 1;
  limit: number = 10;
  total: number = 0;
  masterName: string = 'Farmer';
  villages: any[] = [];

  constructor(
    private apiService: ApiService
  ) {
    this.getData();
  }



  getData() {
    this.apiService.get('farmer', {
      params: {
        page: this.p,
        limit: this.limit
      }
    }).subscribe((data: any) => {
      this.data = data.data;
      this.total = data.meta.total;
      this.p = data.meta.current_page;
      this.limit = data.meta.per_page;
      this.getVillages();
    });
  }

  getVillages() {
    this.apiService.get('village',{
      params: {
        page: 1,
        limit: 1000
      }
    }).subscribe((data: any) => {
      this.villages = data.data;
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

  // addNewItem() {
  //   if (this.masterToAddOrEdit.name === '') {
  //     return;
  //   }
  //   this.apiService.post('farmer', this.masterToAddOrEdit).subscribe((data: any) => {
  //     this.getData();
  //     this.resetMasterToAddOrEdit();
  //   },);
  // }
  addNewItem() {
    if (this.masterToAddOrEdit.name === '') {
      return;
    }

    this.apiService.post('farmer', this.masterToAddOrEdit).subscribe(
      (data: any) => {
        this.getData();
        this.resetMasterToAddOrEdit();
      },
      (error: any) => {
        if (error.status === 400) {
          alert('Mobile number already exists. Please use another mobile number.');
        } else {
          alert('An error occurred. Please try again.');
        }
      }

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
    if (confirm('Are you sure you want to update this farmer?')) {
      if (this.masterToAddOrEditIndex === -1) {
        return;
      }
      this.apiService.put(`farmer/${this.masterToAddOrEdit._id}`, this.masterToAddOrEdit).subscribe((data: any) => {
        this.getData();
        this.resetMasterToAddOrEdit();
      });
    }
  }

  deleteItem(index: number) {
    if (confirm('Are you sure you want to delete this farmer?')) {
      this.apiService.delete(`farmer/${this.data[index]._id}`).subscribe((data: any) => {
        this.getData();
      });
    }
  }

}
