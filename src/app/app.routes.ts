import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { Login } from './pages/auth/login/login';
import { Dashboard } from './pages/home/dashboard/dashboard';
import { CanActivate } from '@angular/router';
import { authGuard } from './Guards/autentication/auth-guard';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },

    {
        path: 'dashboard',
        component: Dashboard,
        canActivate : [authGuard]
    
    }
];
