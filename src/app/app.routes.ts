import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { Login } from './pages/auth/login/login';
import { Dashboard } from './pages/home/dashboard/dashboard';
import { CanActivate } from '@angular/router';
import { authGuard } from './Guards/autentication/auth-guard';
import { Register } from './pages/auth/register/register';
import { LogoTaskly } from './component/logo-taskly/logo-taskly';

export const routes: Routes = [
    {
        path: '',
        component: Login
    },

    {
        path: 'dashboard',
        component: Dashboard,
        canActivate : [authGuard]
    
    },
    {
        path: 'register',
        component: Register
    },
    {
        path: 'logo-taskly',
        component: LogoTaskly
    }

];
