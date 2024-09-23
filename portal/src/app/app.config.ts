import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor, errorHandlingInterceptor } from './http.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, errorHandlingInterceptor])
    ),
  ],
};

export const roleWiseAccess = [
  {
    page: 'dashboard',
    roles: ['Admin', 'User'],
  },
  {
    page: 'taul-parchi',
    roles: ['Admin'],
  },
  {
    page: 'truck-loading-parchi',
    roles: ['Admin'],
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
    page: 'parties',
    roles: ['Admin'],
  },
  {
    page: 'delivery',
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
];
