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
      icon: 'fi-rr-list',
      link: '/taul-parchi'
    },
    {
      title: 'Truck Loading Parchi',
      icon: 'fi-rr-wallet',
      link: '/truck-loading-parchi'
    },
    // {
    //   title: 'Masters',
    //   icon: 'fi-rr-database',
    //   link: '/masters'
    // },
    {
      title:'Farmers',
      icon: 'fi-rr-database',
      link:'/farmers'
    },
    {
      title:'Villages',
      icon: 'fi-rr-database',
      link:'/villages'
    },
    {
      title:'Hammals',
      icon: 'fi-rr-database',
      link:'/hammals'
    },
    {
      title:'Crops',
      icon: 'fi-rr-database',
      link:'/crops'
    },
    {
      title:'Parties',
      icon: 'fi-rr-database',
      link:'/parties'
    },
    {
      title:'Delivery Locations',
      icon: 'fi-rr-database',
      link:'/delivery'
    },
    {
      title: 'Trucks',
      icon: 'fi-rr-settings',
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
      icon: 'fi-rr-settings',
      link: '/accounts'
    },
    {
      title: 'Inventory',
      icon: 'fi-rr-settings',
      link: '/inventory'
    },
    // {
    //   title: 'Transaction',
    //   icon: 'fi-rr-settings',
    //   link: '/transaction'
    // },
    {
      title: 'Transaction List',
      icon: 'fi-rr-settings',
      link: '/transactionlist'
    },
     {
      title: 'List',
      icon: 'fi-rr-settings',
      link: '/list'
    },
    {
      title: 'My List',
      icon: 'fi-rr-settings',
      link: '/my-list'
    },
    {
      title: 'Advance Payments',
      icon: 'fi-rr-settings',
      link: '/advance-payment'
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
