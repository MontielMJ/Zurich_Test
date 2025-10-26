import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface LoginResponse {
  token: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://zurich_api:8080/api';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  
  login(credentials: LoginRequest): Observable<LoginResponse> {
    const url = `${this.baseUrl}/Auth/login`;
    console.log('Enviando credenciales a:', url);
    console.log('Credenciales:', { 
      email: credentials.username, 
      password: '***' //
    });
    
    return this.http.post<LoginResponse>(url, credentials, { 
      headers: this.getHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`).pipe(
      catchError(this.handleError)
    );
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data, { 
      headers: this.getHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data, { 
      headers: this.getHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 0) {
        errorMessage = 'No se puede conectar con el servidor. Verifique que el backend esté ejecutándose.';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Credenciales inválidas';
      } else if (error.status === 401) {
        errorMessage = 'Usuario o contraseña incorrectos';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor';
      } else {
        errorMessage = `Error ${error.status}: ${error.error?.message || error.message}`;
      }
    }
    
    console.error('Error en la petición:', error);
    return throwError(() => new Error(errorMessage));
  }
}