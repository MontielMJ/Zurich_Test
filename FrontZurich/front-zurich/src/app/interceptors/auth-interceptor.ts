import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Obtener el token
  const token = authService.getToken();

  // Clonar la request y agregar el header de autorización si existe el token
  if (token && !req.url.includes('/Auth/login')) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Token agregado a la request:', authReq.url);
    return next(authReq);
  }

  console.log('Request sin token:', req.url);
  return next(req);
};