import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-masters',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './masters.component.html',
  styleUrl: './masters.component.css'
})
export class MastersComponent {

  isEdit: 'Update' | 'Add' | undefined;

  mastersTypes = [
    {
      title: 'Farmers',
      icon: 'fi-rr-user',
      link: '/farmers'
    },
    {
      title: 'Villages',
      icon: 'fi-rr-home',
      link: '/villages'
    },
    {
      title: 'Hammals',
      icon: 'fi-rr-user',
      link: '/hammals'
    },
    {
      title: 'Crops',
      icon: 'fi-rr-leaf',
      link: '/crops'
    },
    {
      title: 'Parties',
      icon: 'fi-rr-user',
      link: '/parties'
    },
    {
      title: 'Delivery Locations',
      icon: 'fi-rr-home',
      link: '/delivery-locations'
    }
  ];

  selectedMasterType: string = 'Farmers';

  data: any[] = [];

  masterToAddOrEdit: any = {};
  masterToAddOrEditIndex: number = -1;

  constructor(
    private sharedService: SharedService
  ) {
    this.getDataOnMasterType();
  }

  selectMasterType(masterType: string) {
    this.selectedMasterType = masterType;
    this.getDataOnMasterType();
  }

  getDataOnMasterType() {
    switch (this.selectedMasterType) {
      case 'Farmers':
        this.data = this.sharedService.Farmers;
        break;
      case 'Villages':
        this.data = this.sharedService.Villages;
        break;
      case 'Hammals':
        this.data = this.sharedService.Hammals;
        break;
      case 'Crops':
        this.data = this.sharedService.Crops;
        break;
      case 'Parties':
        this.data = this.sharedService.Parties;
        break;
      case 'Delivery Locations':
        this.data = this.sharedService.DeliveryLocations;
        break;
      default:
        this.data = [];
        break;
    }
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
    const newItem = { name: this.masterToAddOrEdit.name }; // Replace with actual item data
    this.sharedService.addItem(this.selectedMasterType, newItem);
    this.getDataOnMasterType();
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
    if (confirm('Are you sure you want to update this item?')) {
      const updatedItem = { name: this.masterToAddOrEdit.name }; // Replace with actual updated data
      this.sharedService.editItem(this.selectedMasterType, index, updatedItem);
      this.getDataOnMasterType();
      this.masterToAddOrEdit = {};
      this.masterToAddOrEditIndex = -1;
      this.isEdit = undefined;
    }
  }

  deleteItem(index: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.sharedService.deleteItem(this.selectedMasterType, index);
      this.getDataOnMasterType();
    }
  }

}
