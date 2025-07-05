import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { Dashboard } from './pages/home/dashboard/dashboard';
import { authGuard } from './Guards/autentication/auth-guard';
import { guestGuard } from './Guards/guest-guard';
import { ProjectList } from './pages/projects/project-list/project-list';
import { strictProjectGuard } from './Guards/strict-project-guard-guard';
import { HistoriaUsuario } from './pages/historia-usuario/historia-usuario';

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
  },
  {
    path: 'project_list',
    component: ProjectList,
    canActivate: [strictProjectGuard]  
  },
  {
    path: 'historia-usuario',
    component: HistoriaUsuario,
    canActivate: [strictProjectGuard]  
  }

];