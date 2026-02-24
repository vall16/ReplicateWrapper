import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/hero/hero.component').then(m => m.HeroComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/login/privacy.component').then(m => m.PrivacyComponent)
  },
  {
    path: 'terms',
    loadComponent: () => import('./pages/login/terms.component').then(m => m.TermsComponent)
  },
  {
    path: 'security',
    loadComponent: () => import('./pages/login/security.component').then(m => m.SecurityComponent)
  },
  
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'store',
    loadComponent: () => import('./pages/store/store.component').then(m => m.StoreComponent)
  },
  {
    path: 'transactions',
    loadComponent: () => import('./pages/transactions/transactions.component').then(m => m.TransactionsComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  }
];
