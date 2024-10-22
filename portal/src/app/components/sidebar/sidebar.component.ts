import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { roleWiseAccess } from '../../app.config';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  @Output() toggleSidebar: EventEmitter<any> = new EventEmitter<any>();
  /**
   * Menu items
   * @type {Array}
   * @memberof SidebarComponent
   * @public
   * Dashboard, Cameras, Detections, Reports, Profile, Settings
   */
  menuItems = [
    {
      title: 'Dashboard',
      icon: 'fi-rr-home',
      link: '/dashboard'
    },
    {
      title: 'Taul Parchi',
      icon: 'fi fi-rr-document',
      link: '/taul-parchi'
    },
    {
      title: 'Truck Loading Parchi',
      icon: 'fi-rr-wallet',
      link: '/truck-loading-parchi'
    },
    {
      title:'Farmers',
      icon: 'fi-rr-database',
      link:'/farmers'
    },
    {
      title:'Villages',
      icon: 'fi fi-rr-map',
      link:'/villages'
    },
    {
      title:'Hammals',
      icon: 'fi fi-rr-paw',
      link:'/hammals'
    },
    {
      title:'Crops',
      icon: 'fi fi-rr-leaf',
      link:'/crops'
    },
    {
      title:'Parties',
      icon: 'fi fi-rr-users',
      link:'/parties'
    },
    {
      title:'Delivery Locations',
      icon: 'fi fi-rr-map-marker',
      link:'/delivery'
    },
    {
      title:'Storage Locations',
      icon: 'fi fi-rr-box',
      link:'/storage'
    },
    {
      title: 'Trucks',
      icon: 'fi fi-rr-route',
      link: '/truck'
    },
    {
      title: 'Profile',
      icon: 'fi-rr-user',
      link: '/profile'
    },
    {
      title: 'Settings',
      icon: 'fi-rr-settings',
      link: '/settings'
    },
    {
      title: 'Accounts',
      icon: 'fi fi-rr-user-check',
      link: '/accounts'
    },
    {
      title: 'Inventory',
      icon: 'fi fi-rr-list',
      link: '/inventory'
    },
    {
      title: 'Transaction List',
      icon: 'fi fi-rr-receipt',
      link: '/transactionlist'
    },
     {
      title: 'List',
      icon: 'fi fi-rr-list-check',
      link: '/list'
    },
    {
      title: 'My List',
      icon: 'fi fi-rr-clipboard',
      link: '/my-list'
    },
    {
      title: 'Advance Payments',
      icon: 'fi fi-rr-wallet',
      link: '/advance-payment'
    },
    {
      title: 'Wearhouse Accounts',
      icon: 'fi fi-rr-wallet',
      link: '/wearhouse-accounts'
    },
    {
      title: 'Wearhouse Inventory',
      icon: 'fi fi-rr-wallet',
      link: '/wearhouse-inventory'
    }
  ];

  constructor(
    private authService: AuthService
  ) { }

  getMenuItems() {
    return this.menuItems.filter((item) => {
      const pageAccess = roleWiseAccess.find((p) => p.page === item.link.split('/')[1]);
      if (!pageAccess) {
        return false;
      }
      const roles = pageAccess.roles;
      const userStringObj = localStorage.getItem('user');
      if (!userStringObj) {
        return false;
      }
      const user = JSON.parse(userStringObj);
      const userRole = user.role;
      if (!roles.includes(userRole)) {
        return false;
      }
      return true;
    });
  }
}
