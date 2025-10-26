import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
   constructor(private apiService: ApiService, private authService:AuthService) { }

  getClientes(): Observable<Cliente[]> {
    return this.apiService.get<Cliente[]>('client');
  }

  getCliente(id: number): Observable<Cliente> {
    return this.apiService.get<Cliente>(`client/${id}`);
  }

  createCliente(cliente: Cliente): Observable<Cliente> {
     const clienteData = this.prepareClienteData(cliente);
    return this.apiService.post<Cliente>('Client', clienteData);
  }

  updateCliente(id: number, cliente: Cliente): Observable<Cliente> {
     const clienteData = this.prepareClienteData(cliente);
    return this.apiService.put<Cliente>(`Client`, clienteData);
  }

  deleteCliente(id: number): Observable<any> {
    return this.apiService.delete<any>(`client/${id}`);
  }
   private prepareClienteData(cliente: Cliente): any {
    return {
      ...cliente,
      email: typeof cliente.email === 'string' 
        ? { value: cliente.email } 
        : cliente.email
    };
  }
}
