import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { managerGuard } from './core/guards/manager-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'registro',
    loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent),
  },
  {
    path: 'admin',
    loadComponent: () => import('./shared/components/sidenav-layout/sidenav-layout').then(m => m.SidenavLayoutComponent),
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.DashboardComponent) },
      { path: 'restaurantes', loadComponent: () => import('./features/admin/restaurants/restaurants').then(m => m.RestaurantsComponent) },
      { path: 'chamados', loadComponent: () => import('./features/admin/bug-reports/bug-reports').then(m => m.BugReportsComponent) },
      { path: 'filas', loadComponent: () => import('./features/admin/queues/queues').then(m => m.QueuesComponent) },
    ],
  },
  {
    path: 'gerente',
    loadComponent: () => import('./shared/components/sidenav-layout/sidenav-layout').then(m => m.SidenavLayoutComponent),
    canActivate: [managerGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/manager/dashboard/dashboard').then(m => m.DashboardComponent) },
      { path: 'restaurantes', loadComponent: () => import('./features/manager/my-restaurants/my-restaurants').then(m => m.MyRestaurantsComponent) },
      { path: 'restaurantes/criar', loadComponent: () => import('./features/restaurant/create-restaurant/create-restaurant').then(m => m.CreateRestaurantComponent) },
      { path: 'fila/:id', loadComponent: () => import('./features/manager/my-queue/my-queue').then(m => m.MyQueueComponent) },
      { path: 'chamados', loadComponent: () => import('./features/manager/open-report/open-report').then(m => m.OpenReportComponent) },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
