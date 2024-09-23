import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  toasts: any[] = [];
  scope_id = Date.now();
  isLoading = false;

  // Initialize data from localStorage or use default values
  Farmers = this.getFromLocalStorage('Farmers') || [
    { name: 'Rohit Nigam', firm_company: 'Rohit Sharma & Co.' },
    { name: 'Aakash Sharma', firm_company: 'Mahesh Sharma & Co.' },
    { name: 'Navnnet Verma', firm_company: 'Navnnet Verma & Co.' },
    { name: 'Rohit Singh', firm_company: 'Lalit Singh & Co.' }
  ];

  Villages = this.getFromLocalStorage('Villages') || [
    { name: 'Sikar' },
    { name: 'Jaipur' },
    { name: 'Jodhpur' },
    { name: 'Ajmer' }
  ];

  Hammals = this.getFromLocalStorage('Hammals') || [
    { name: 'Rajesh' },
    { name: 'Ramesh' },
    { name: 'Suresh' },
    { name: 'Mahesh' }
  ];

  Crops = this.getFromLocalStorage('Crops') || [
    { name: 'Genhu - Sharbati' },
    { name: 'Chawal - Basmati' },
    { name: 'Gehu - Lokwan' },
    { name: 'Chana - Desi' }
  ];

  Parties = this.getFromLocalStorage('Parties') || [
    { name: 'TSS' },
    { name: 'Manohar Goods' },
    { name: 'Sharma Transport' },
    { name: 'Rajesh Transport' }
  ];

  DeliveryLocations = this.getFromLocalStorage('DeliveryLocations') || [
    { name: 'Jaipur' },
    { name: 'Jodhpur' },
    { name: 'Ajmer' },
    { name: 'Sikar' }
  ];

  TaulParchis = this.getFromLocalStorage('TaulParchis') || [];
  TruckLoadingParchis = this.getFromLocalStorage('TruckLoadingParchis') || [];

  constructor() {
    this.saveAllToLocalStorage();
  }

  // Utility method to get data from localStorage
  private getFromLocalStorage(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  // Utility method to save data to localStorage
  private saveToLocalStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Save all data to localStorage
  private saveAllToLocalStorage() {
    this.saveToLocalStorage('Farmers', this.Farmers);
    this.saveToLocalStorage('Villages', this.Villages);
    this.saveToLocalStorage('Hammals', this.Hammals);
    this.saveToLocalStorage('Crops', this.Crops);
    this.saveToLocalStorage('Parties', this.Parties);
    this.saveToLocalStorage('DeliveryLocations', this.DeliveryLocations);
    this.saveToLocalStorage('TaulParchis', this.TaulParchis);
    this.saveToLocalStorage('TruckLoadingParchis', this.TruckLoadingParchis);
  }

  addToast(toast: any) {
    this.toasts.push(toast);
  }

  removeToast(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  addItem(masterType: string, item: any) {
    switch (masterType) {
      case 'Farmers':
        this.Farmers.push(item);
        this.saveToLocalStorage('Farmers', this.Farmers);
        break;
      case 'Villages':
        this.Villages.push(item);
        this.saveToLocalStorage('Villages', this.Villages);
        break;
      case 'Hammals':
        this.Hammals.push(item);
        this.saveToLocalStorage('Hammals', this.Hammals);
        break;
      case 'Crops':
        this.Crops.push(item);
        this.saveToLocalStorage('Crops', this.Crops);
        break;
      case 'Parties':
        this.Parties.push(item);
        this.saveToLocalStorage('Parties', this.Parties);
        break;
      case 'Delivery Locations':
        this.DeliveryLocations.push(item);
        this.saveToLocalStorage('DeliveryLocations', this.DeliveryLocations);
        break;
      case 'Taul Parchis':
        this.TaulParchis.push(item);
        this.saveToLocalStorage('TaulParchis', this.TaulParchis);
        break;
      case 'Truck Loading Parchis':
        this.TruckLoadingParchis.push(item);
        this.saveToLocalStorage('TruckLoadingParchis', this.TruckLoadingParchis);
        break;
    }
  }

  editItem(masterType: string, index: number, updatedItem: any) {
    switch (masterType) {
      case 'Farmers':
        this.Farmers[index] = updatedItem;
        this.saveToLocalStorage('Farmers', this.Farmers);
        break;
      case 'Villages':
        this.Villages[index] = updatedItem;
        this.saveToLocalStorage('Villages', this.Villages);
        break;
      case 'Hammals':
        this.Hammals[index] = updatedItem;
        this.saveToLocalStorage('Hammals', this.Hammals);
        break;
      case 'Crops':
        this.Crops[index] = updatedItem;
        this.saveToLocalStorage('Crops', this.Crops);
        break;
      case 'Parties':
        this.Parties[index] = updatedItem;
        this.saveToLocalStorage('Parties', this.Parties);
        break;
      case 'Delivery Locations':
        this.DeliveryLocations[index] = updatedItem;
        this.saveToLocalStorage('DeliveryLocations', this.DeliveryLocations);
        break;
      case 'Taul Parchis':
        this.TaulParchis[index] = updatedItem;
        this.saveToLocalStorage('TaulParchis', this.TaulParchis);
        break;
      case 'Truck Loading Parchis':
        this.TruckLoadingParchis[index] = updatedItem;
        this.saveToLocalStorage('TruckLoadingParchis', this.TruckLoadingParchis);
        break;
    }
  }

  deleteItem(masterType: string, index: number) {
    switch (masterType) {
      case 'Farmers':
        this.Farmers.splice(index, 1);
        this.saveToLocalStorage('Farmers', this.Farmers);
        break;
      case 'Villages':
        this.Villages.splice(index, 1);
        this.saveToLocalStorage('Villages', this.Villages);
        break;
      case 'Hammals':
        this.Hammals.splice(index, 1);
        this.saveToLocalStorage('Hammals', this.Hammals);
        break;
      case 'Crops':
        this.Crops.splice(index, 1);
        this.saveToLocalStorage('Crops', this.Crops);
        break;
      case 'Parties':
        this.Parties.splice(index, 1);
        this.saveToLocalStorage('Parties', this.Parties);
        break;
      case 'Delivery Locations':
        this.DeliveryLocations.splice(index, 1);
        this.saveToLocalStorage('DeliveryLocations', this.DeliveryLocations);
        break;
      case 'Taul Parchis':
        this.TaulParchis.splice(index, 1);
        this.saveToLocalStorage('TaulParchis', this.TaulParchis);
        break;
      case 'Truck Loading Parchis':
        this.TruckLoadingParchis.splice(index, 1);
        this.saveToLocalStorage('TruckLoadingParchis', this.TruckLoadingParchis);
        break;
    }
  }
}