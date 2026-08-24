import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'restaurantes/criar',
    loadComponent: () =>
      import('./features/restaurant/create-restaurant/create-restaurant').then(
        (m) => m.CreateRestaurantComponent
      ),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'login' },
];
