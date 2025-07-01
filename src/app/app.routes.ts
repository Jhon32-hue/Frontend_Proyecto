import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { Dashboard } from './pages/home/dashboard/dashboard';
import { authGuard } from './Guards/autentication/auth-guard';
import { guestGuard } from './Guards/guest-guard';

export const routes: Routes = [
  {
    path: '', 
    component: Login,
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    component: Register,
    canActivate: [guestGuard]
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  }
];
