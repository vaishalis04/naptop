import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor, errorHandlingInterceptor } from './http.interceptor';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptors([authInterceptor, errorHandlingInterceptor])),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
],
};

export const roleWiseAccess = [
  {
    page: 'dashboard',
    roles: ['Admin', 'User','Employee','cashier'],
  },
  {
    page: 'taul-parchi',
    roles: ['Admin','Employee'],
  },
  {
    page: 'truck-loading-parchi',
    roles: ['Admin','Employee'],
  },
  {
    page: 'masters',
    roles: ['Admin'],
  },
  {
    page: 'farmers',
    roles: ['Admin'],
  },
  {
    page: 'villages',
    roles: ['Admin'],
  },
  {
    page: 'hammals',
    roles: ['Admin'],
  },
  {
    page: 'crops',
    roles: ['Admin'],
  },
  {
    page: 'companies',
    roles: ['Admin'],
  },
  {
    page: 'transport',
    roles: ['Admin'],
  },
  {
    page: 'parties',
    roles: ['Admin'],
  },
  {
    page: 'delivery',
    roles: ['Admin'],
  },
  {
    page: 'storage',
    roles: ['Admin'],
  },
  {
    page: 'stock-view',
    roles: ['Admin'],
  },
  {
    page: 'profile',
    roles: ['Admin'],
  },
  {
    page: 'settings',
    roles: ['Admin'],
  },
  {
    page: 'accounts',
    roles: ['Admin','cashier'],
  },
  {
    page: 'inventory',
    roles: ['Admin','cashier'],
  },
  {
    page: 'transaction',
    roles: ['Admin','cashier'],
  },
  {
    page: 'transactionlist',
    roles: ['Admin','cashier'],
  },
  {
    page: 'truck',
    roles: ['Admin'],
  },
  {
    page: 'list',
    roles: ['Admin','cashier'],
  },
  {
    page: 'my-list',
    roles: ['Admin','Employee'],
  },
  {
    page: 'advance-payment',
    roles: ['Admin'],
  },
  {
    page: 'wearhouse-accounts',
    roles: ['Admin'],
  },
  {
    page: 'wearhouse-inventory',
    roles: ['Admin'],
  },
  {
    page: 'taul-parchi-dashboard',
    roles: ['Admin'],
  },
  {
    page: 'taul-parchi-view',
    roles: ['Admin'],
  },
  {
    page: 'truck-loading-parchi-dashboard',
    roles: ['Admin'],
  },
  {
    page: 'truck-loading-parchi-view',
    roles: ['Admin'],
  }
];
