import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  // Si ya está logueado, redirigir a clientes
  if (isLoggedIn) {
    router.navigate(['/clientes']);
    return false;
  }
  
  // Si no está logueado, permitir acceso al login
  return true;
};