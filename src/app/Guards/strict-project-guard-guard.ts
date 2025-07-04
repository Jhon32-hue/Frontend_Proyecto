// Guards/strict-project.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const strictProjectGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('accessToken');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const accesoPermitido = sessionStorage.getItem('fromValidNavigation');

  if (accesoPermitido === 'true') {
    sessionStorage.removeItem('fromValidNavigation');
    return true;
  } else {
    router.navigate(['/dashboard']);
    return false;
  }
};
