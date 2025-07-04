import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('accessToken');

  // ✅ Si NO hay token → permitir acceso a login/register
  if (!token) return true;

  // ✅ Validar si la navegación fue controlada
  const accesoPermitido = sessionStorage.getItem('fromGuestNavigation');

  if (accesoPermitido === 'true') {
    sessionStorage.removeItem('fromGuestNavigation'); // evitar reuso
    return true;
  }

  // 🔴 Usuario autenticado intenta forzar acceso a login/register
  router.navigate(['/dashboard']);
  return false;
};
