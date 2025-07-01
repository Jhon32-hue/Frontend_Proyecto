// src/app/Guards/authentication/auth-guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    return Date.now() >= exp * 1000;
  } catch {
    return true; // Si falla el decode, lo tratamos como expirado
  }
}

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('accessToken');

  if (token && !isTokenExpired(token)) {
    return true;
  } else {
    localStorage.removeItem('accessToken'); // Borra token vencido
    router.navigate(['']);
    return false;
  }
};
