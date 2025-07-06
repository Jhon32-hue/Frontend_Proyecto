import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('accessToken');

  // Usuario no autenticado → puede entrar
  if (!token) return true;

  // Usuario autenticado → redirigir
  router.navigate(['/dashboard']);
  return false;
};

