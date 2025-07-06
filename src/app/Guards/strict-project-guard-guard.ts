import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const strictProjectGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('accessToken');

  // Si no hay token, redirige a login
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // Verifica si se ha navegado correctamente desde el Dashboard
  const accesoPermitido = sessionStorage.getItem('fromValidNavigation');

  // Si el usuario está en una ruta protegida, pero no ha navegado adecuadamente desde el Dashboard
  if (accesoPermitido !== 'true') {
    // Si el acceso no está permitido y el usuario no ha pasado por el flujo adecuado
    // Redirige a la página deseada en lugar de siempre al dashboard
    router.navigate(['/dashboard']);
    return false;
  }

  // Si está permitido acceder y se ha navegado adecuadamente
  // Deja pasar a la ruta sin necesidad de volver a dashboard
  return true;
};
