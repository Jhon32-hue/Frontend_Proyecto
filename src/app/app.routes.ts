import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { Dashboard } from './pages/home/dashboard/dashboard';
import { authGuard } from './Guards/autentication/auth-guard';
import { guestGuard } from './Guards/guest-guard';
import { ProjectList } from './pages/projects/project-list/project-list';
import { strictProjectGuard } from './Guards/strict-project-guard-guard';
import { HistoriaUsuario } from './pages/historia-usuario/historia-usuario';
import { KanbanHu } from './component/kanban-hu/kanban-hu';
import { VerifyAccount } from './pages/auth/verify-account/verify-account';
import { TaskList } from './pages/tasks/task-list/task-list';
import { UserProfile } from './pages/users/user-profile/user-profile';

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
  },
  {
  path: 'historia-usuario/:id/hu',
  component: HistoriaUsuario,
  canActivate: [strictProjectGuard]
},
{
  path: 'verify-account',
  component: VerifyAccount,
  canActivate: [guestGuard]
},
{
   path: 'task-list',
  component: TaskList,
},
{
  path: 'user-profile',
  component: UserProfile,
  canActivate: [strictProjectGuard]
}

];