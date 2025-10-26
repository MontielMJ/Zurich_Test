import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);


  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }


  const requiredRole = route.data?.['role'];


  if (!requiredRole) {
    return true;
  }


  const hasRole = authService.hasRole(requiredRole);
  
  if (!hasRole) {
    console.warn('Acceso denegado. Rol requerido:', requiredRole, 'Rol actual:', authService.getUserRole());
    router.navigate(['/polizas']);
    return false;
  }
  return true;
};