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
import { AccountsComponent } from './pages/accounts/accounts.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { TransactionComponent } from './pages/transaction/transaction.component';
import { TransactionlistComponent } from './pages/transactionlist/transactionlist.component';
import { TruckComponent } from './pages/truck/truck.component';
import { ListComponent } from './pages/list/list.component';
import { MyListComponent } from './pages/my-list/my-list.component';
import { AdvancePaymentComponent } from './pages/advance-payment/advance-payment.component';
import { StorageComponent } from './pages/storage/storage.component';
import { WearhouseAccountsComponent } from './pages/wearhouse-accounts/wearhouse-accounts.component';
import { WearhouseInventoryComponent } from './pages/wearhouse-inventory/wearhouse-inventory.component';
import { TaulparchiDashboardComponent } from './pages/taulparchi-dashboard/taulparchi-dashboard.component';
import { TaulparchiViewComponent } from './pages/taulparchi-view/taulparchi-view.component';
import { TruckLoadingParchiDashboardComponent } from './pages/truck-loading-parchi-dashboard/truck-loading-parchi-dashboard.component';
import { TruckLoadingParchiViewComponent } from './pages/truck-loading-parchi-view/truck-loading-parchi-view.component';
import { CompanyComponent } from './pages/company/company.component';
import { TransportComponent } from './pages/transport/transport.component';
import { StockViewComponent } from './pages/stock-view/stock-view.component';

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
        path: 'taul-parchi-dashboard',
        component: TaulparchiDashboardComponent,
        data: { title: 'Taul Parchi Dashboard' },
      },
      {
        path: 'taul-parchi-view/:id',
        component:TaulparchiViewComponent ,
        data: { title: 'Taul Parchi View' },
      },
      {
        path: 'truck-loading-parchi',
        component: TruckLoadingParchiComponent,
        data: { title: 'Truck Loading Parchi' },
      },
      {
        path: 'truck-loading-parchi-dashboard',
        component: TruckLoadingParchiDashboardComponent,
        data: { title: 'Truck Loading Parchi Dashboard' },
      },
      {
        path: 'truck-loading-parchi-view/:id',
        component: TruckLoadingParchiViewComponent,
        data: { title: 'Truck Loading Parchi View' },
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
        path: 'companies',
        component: CompanyComponent,
        data: { title: 'companies' },
      },
      {
        path: 'transport',
        component: TransportComponent,
        data: { title: 'transport' },
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
        path: 'storage',
        component: StorageComponent,
        data: { title: 'Storage Locations' },
      },
      {
        path: 'stock-view/:crop_id/:warehouse_id',
        component: StockViewComponent,
        data: { title: 'Stock View' },
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
      {
        path: 'accounts',
        component: AccountsComponent,
        data: { title: 'Accounts' },
      },
      {
        path: 'inventory',
        component: InventoryComponent,
        data: { title: 'Inventory' },
      },
      {
        path: 'transaction',
        component: TransactionComponent,
        data: { title: 'Transaction' },
      },
      {
        path: 'transactionlist',
        component: TransactionlistComponent,
        data: { title: 'Transactionlist' },
      },
      {
        path: 'truck',
        component: TruckComponent,
        data: { title: 'truck' },
      },
      {
        path: 'list',
        component: ListComponent,
        data: { title: 'list' },
      },
      {
        path: 'my-list',
        component: MyListComponent,
        data: { title: 'my-list' },
      },
      {
        path: 'advance-payment',
        component: AdvancePaymentComponent,
        data: { title: 'advance-payment' },
      },
      {
        path: 'wearhouse-accounts',
        component: WearhouseAccountsComponent,
        data: { title: 'wearhouse-accounts' },
      },
      {
        path: 'wearhouse-inventory',
        component: WearhouseInventoryComponent,
        data: { title: 'wearhouse-inventory' },
      },
    ],

  },
  {
    path: '**',
    component: PageNotFoundComponent,
    data: { title: 'Page Not Found' },
  },
];
