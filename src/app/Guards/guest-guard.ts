import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return true; // Usuario no autenticado → puede entrar
  } else {
    router.navigate(['/dashboard']); // Usuario autenticado → redirigir
    return false;
  }
};
