import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PortalLayoutComponent } from './layouts/portal-layout/portal-layout.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { authGuard } from './guards/auth.guard';
import { TaulParchiComponent } from './pages/taul-parchi/taul-parchi.component';
import { TruckLoadingParchiComponent } from './pages/truck-loading-parchi/truck-loading-parchi.component';
import { MastersComponent } from './pages/masters/masters.component';
import { FarmersComponent } from './pages/farmers/farmers.component';
import { VillagesComponent } from './pages/villages/villages.component';
import { HammalsComponent } from './pages/hammals/hammals.component';
import { CropComponent } from './pages/crop/crop.component';
import { PartiesComponent } from './pages/parties/parties.component';
import { DeliveryComponent } from './pages/delivery/delivery.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' },
  },
  {
    // path: 'create-account',
    path: 'sign-up',
    component: SignUpComponent,
    data: { title: 'Sign Up' },
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: { title: 'Forgot Password' },
  },
  {
    path: '',
    component: PortalLayoutComponent,
    canActivateChild: [authGuard],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Dashboard' },
      },
      {
        path: 'taul-parchi',
        component: TaulParchiComponent,
        data: { title: 'Taul Parchi' },
      },
      {
        path: 'truck-loading-parchi',
        component: TruckLoadingParchiComponent,
        data: { title: 'Truck Loading Parchi' },
      },
      {
        path: 'masters',
        component: MastersComponent,
        data: { title: 'Masters' },
      },
      {
        path: 'farmers',
        component: FarmersComponent,
        data: { title: 'Farmers' },
      },
      {
        path: 'villages',
        component: VillagesComponent,
        data: { title: 'Villages' },
      },
      {
        path: 'hammals',
        component: HammalsComponent,
        data: { title: 'Hammals' },
      },
     
      {
        path: 'crops',
        component: CropComponent,
        data: { title: 'Crops' },
      },
      {
        path: 'parties',
        component: PartiesComponent,
        data: { title: 'Parties' },
      },
      {
        path: 'delivery',
        component: DeliveryComponent,
        data: { title: 'Delivery Locations' },
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { title: 'Profile' },
      },
      {
        path: 'settings',
        component: SettingsComponent,
        data: { title: 'Settings' },
      },
    ],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    data: { title: 'Page Not Found' },
  },
];
