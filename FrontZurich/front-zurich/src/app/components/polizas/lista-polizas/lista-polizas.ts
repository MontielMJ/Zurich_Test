import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { Poliza } from '../../../models/poliza';
import { PolizaService } from '../../../services/poliza.service';
import { AuthService } from '../../../services/auth.service';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente';

@Component({
  selector: 'app-lista-polizas',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatMenuModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './lista-polizas.html',
  styleUrls: ['./lista-polizas.css']
})
export class ListaPolizasComponent implements OnInit, OnDestroy {
  polizas: Poliza[] = [];
  todasLasPolizas: Poliza[] = []; // Guardar todas las pólizas para filtros
  displayedColumns: string[] = ['folio', 'tipo', 'fechaInicio', 'fechaFin', 'montoAsegurado', 'estado', 'acciones'];
  isLoading = false;


  tiposPoliza: string[] = ['Auto', 'Vida', 'Hogar', 'Salud', 'Empresarial'];
  filtroTipo: string = '';
  filtroEstado: string = '';
  

  clienteId: number | null = null;
  clienteSeleccionado: Cliente | null = null;
  clientes: Cliente[] = [];
  filtroCliente: number | null = null;

  private routeSubscription!: Subscription;

  constructor(
    private polizaService: PolizaService,
    private clienteService: ClienteService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.routeSubscription = this.route.queryParams.subscribe(params => {
      this.clienteId = params['clienteId'] ? Number(params['clienteId']) : null;
      
      if (this.authService.isAdmin()) {
        this.cargarClientes();
      }
      
      this.cargarPolizas();
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  cargarPolizas(): void {
    this.isLoading = true;
    
    if (this.clienteId) {
      this.polizaService.getPolizasPorCliente(this.clienteId).subscribe({
        next: (polizas) => {
          this.polizas = polizas;
          this.todasLasPolizas = polizas;
          this.isLoading = false;
          console.log('Pólizas del cliente cargadas:', polizas);
          if (this.clienteId && this.authService.isAdmin()) {
            this.cargarClienteSeleccionado(this.clienteId);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.showError('Error al cargar las pólizas del cliente: ' + (error.message || 'Error desconocido'));
          console.error('Error al cargar pólizas del cliente:', error);
        }
      });
    } else {
      this.polizaService.getPolizas().subscribe({
        next: (polizas) => {
          this.polizas = polizas;
          this.todasLasPolizas = polizas;
          this.isLoading = false;
          console.log('Todas las pólizas cargadas:', polizas);
        },
        error: (error) => {
          this.isLoading = false;
          this.showError('Error al cargar las pólizas: ' + (error.message || 'Error desconocido'));
          console.error('Error al cargar pólizas:', error);
        }
      });
    }
  }

  cargarClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        console.log('Clientes cargados para filtro:', clientes);
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
      }
    });
  }

  cargarClienteSeleccionado(clienteId: number): void {
    this.clienteService.getCliente(clienteId).subscribe({
      next: (cliente) => {
        this.clienteSeleccionado = cliente;
        console.log('Cliente seleccionado:', cliente);
      },
      error: (error) => {
        console.error('Error al cargar cliente seleccionado:', error);
      }
    });
  }

  eliminarPoliza(id: number): void {
    if (confirm('¿Está seguro de eliminar esta póliza?')) {
      this.polizaService.deletePoliza(id).subscribe({
        next: () => {
          this.showSuccess('Póliza eliminada exitosamente');
          this.cargarPolizas();
        },
        error: (error) => {
          this.showError('Error al eliminar la póliza: ' + (error.message || 'Error desconocido'));
          console.error('Error al eliminar póliza:', error);
        }
      });
    }
  }

  getFolioDisplay(poliza: Poliza): number {
    return poliza.folio?.value || 0;
  }

  formatFecha(fecha: string | Date): string {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES');
  }


  formatMoneda(monto: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(monto);
  }

  getClienteDisplay(poliza: Poliza): string {
    if (this.clienteSeleccionado && poliza.idClient === this.clienteSeleccionado.id) {
      return this.clienteSeleccionado.fullname;
    }
    const cliente = this.clientes.find(c => c.id === poliza.idClient);
    return cliente ? cliente.fullname : `Cliente #${poliza.idClient}`;
  }


  get polizasFiltradas(): Poliza[] {
    let filtered = this.polizas;

    if (this.filtroTipo) {
      filtered = filtered.filter(poliza => 
        poliza.idTypePolicy.toLowerCase().includes(this.filtroTipo.toLowerCase())
      );
    }

    if (this.filtroEstado) {
      const estadoBool = this.filtroEstado === 'activa';
      filtered = filtered.filter(poliza => poliza.status === estadoBool);
    }

    if (this.filtroCliente && !this.clienteId && this.authService.isAdmin()) {
      filtered = filtered.filter(poliza => poliza.idClient === this.filtroCliente);
    }

    return filtered;
  }


  limpiarFiltros(): void {
    this.filtroTipo = '';
    this.filtroEstado = '';
    this.filtroCliente = null;

    if (!this.clienteId) {
      this.polizas = [...this.todasLasPolizas];
    }
  }

  onClienteChange(): void {
    if (this.filtroCliente) {
      this.polizas = this.todasLasPolizas.filter(poliza => poliza.idClient === this.filtroCliente);
    } else {
      this.polizas = [...this.todasLasPolizas];
    }
  }

  estaProximaVencer(poliza: Poliza): boolean {
    const fechaFin = new Date(poliza.endDate);
    const hoy = new Date();
    const diferenciaMs = fechaFin.getTime() - hoy.getTime();
    const diferenciaDias = diferenciaMs / (1000 * 60 * 60 * 24);
    
    return diferenciaDias <= 7 && diferenciaDias > 0 && poliza.status;
  }

estaVencida(poliza: Poliza): boolean {
  if (!poliza.status) {
    return false; 
  }
  const fechaFin = new Date(poliza.endDate);
  const hoy = new Date();
  const fechaFinDate = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), fechaFin.getDate());
  const hoyDate = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  
  return fechaFinDate < hoyDate;
}

  crearPolizaParaCliente(): void {
    if (this.clienteId) {
      this.router.navigate(['/polizas/crear'], { 
        queryParams: { clienteId: this.clienteId } 
      });
    } else {
      this.router.navigate(['/polizas/crear']);
    }
  }

  esVistaClienteEspecifico(): boolean {
    return this.clienteId !== null;
  }

  
  getTipoColor(tipo: string): string {
  const clases: { [key: string]: string } = {
    'Auto': 'auto-chip',
    'Vida': 'vida-chip',
    'Hogar': 'hogar-chip',
    'Salud': 'salud-chip',
    'Empresarial': 'empresarial-chip',
    'Viaje': 'viaje-chip',
    'Responsabilidad Civil': 'rc-chip'
  };
  return clases[tipo] || '';
}

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}