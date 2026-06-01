import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/hero/hero.component').then(m => m.HeroComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'privacy', loadComponent: () => import('./pages/login/privacy.component').then(m => m.PrivacyComponent) },
  { path: 'terms', loadComponent: () => import('./pages/login/terms.component').then(m => m.TermsComponent) },
  { path: 'security', loadComponent: () => import('./pages/login/security.component').then(m => m.SecurityComponent) },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard] },
  { path: 'store', loadComponent: () => import('./pages/store/store.component').then(m => m.StoreComponent), canActivate: [authGuard] },
  { path: 'transactions', loadComponent: () => import('./pages/transactions/transactions.component').then(m => m.TransactionsComponent), canActivate: [authGuard] },
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent), canActivate: [authGuard] },
  { path: 'generate', loadComponent: () => import('./pages/generate/generate.component').then(m => m.GenerateComponent), canActivate: [authGuard] },
  { path: 'video-generate', loadComponent: () => import('./pages/video-generate/video-generate.component').then(m => m.VideoGenerateComponent), canActivate: [authGuard] },
  { path: 'img-video-generate', loadComponent: () => import('./pages/img-video-generate/img-video-generate.component').then(m => m.ImgVideoGenerateComponent), canActivate: [authGuard] },
  { path: 'gallery', loadComponent: () => import('./pages/gallery/gallery.component').then(m => m.GalleryComponent), canActivate: [authGuard] },
];
