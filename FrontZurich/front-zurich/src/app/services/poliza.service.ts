import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Poliza } from '../models/poliza';


@Injectable({
  providedIn: 'root'
})
export class PolizaService {
  constructor(private apiService: ApiService) { }

  getPolizas(): Observable<Poliza[]> {
    return this.apiService.get<Poliza[]>('policy');
  }

  getPoliza(id: number): Observable<Poliza> {
    return this.apiService.get<Poliza>(`policy/${id}`);
  }

  createPoliza(poliza: Poliza): Observable<Poliza> {
    console.log('Creating poliza:', poliza);
    const polizaData = this.preparePolizaData(poliza);
    return this.apiService.post<Poliza>(`policy/${poliza.idClient}`, polizaData);
  }

  updatePoliza(id: number, poliza: Poliza): Observable<Poliza> {
    const polizaData = this.preparePolizaData(poliza);
    poliza.id = id; 
    return this.apiService.put<Poliza>(`policy/${id}`, polizaData);
  }

  deletePoliza(id: number): Observable<any> {
    return this.apiService.delete<any>(`policy/${id}`);
  }

  getPolizasPorCliente(clienteId: number): Observable<Poliza[]> {
    return this.apiService.get<Poliza[]>(`policy/ByClient/${clienteId}`);
  }
  private preparePolizaData(poliza: Poliza): any {
    return {
      ...poliza,
      folio: typeof poliza.folio === 'number'
        ? { value: poliza.folio }
        : poliza.folio
    };
  }
}
