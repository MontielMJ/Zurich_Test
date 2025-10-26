import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Poliza, Folio } from '../../../models/poliza';
import { PolizaService } from '../../../services/poliza.service';
import { AuthService } from '../../../services/auth.service';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente';
@Component({
  selector: 'app-crear-poliza',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './crear-poliza.html',
  styleUrls: ['./crear-poliza.css']
})
export class CrearPolizaComponent implements OnInit {
  polizaForm: FormGroup;
  isLoading = false;
  clientes: Cliente[] = [];
  clienteIdFromUrl: number | null = null;
  clienteSeleccionado: Cliente | null = null;

  // Opciones para tipos de póliza
  tiposPoliza: string[] = ['Auto', 'Vida', 'Hogar', 'Salud', 'Empresarial', 'Viaje', 'Responsabilidad Civil'];

  // Configuración de fechas
  minDate: Date;
  maxDate: Date;

  constructor(
    private fb: FormBuilder,
    private polizaService: PolizaService,
    private clienteService: ClienteService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    // Configurar fechas mínima y máxima
    this.minDate = new Date();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() + 10); // 10 años máximo

    this.polizaForm = this.createForm();
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Verificar si viene de un cliente específico
    this.route.queryParams.subscribe(params => {
      this.clienteIdFromUrl = params['clienteId'] ? Number(params['clienteId']) : null;
      
      if (this.clienteIdFromUrl) {
        this.cargarClienteEspecifico(this.clienteIdFromUrl);
      }
      
      this.cargarClientes();
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      folio: ['', [Validators.required, Validators.min(1)]],
      idTypePolicy: ['', Validators.required],
      initDate: ['', Validators.required],
      endDate: ['', Validators.required],
      insuredAmount: ['', [Validators.required, Validators.min(1000), Validators.max(100000000)]],
      idClient: ['', Validators.required],
      status: [true]
    }, { validators: this.dateRangeValidator });
  }

  // Validador personalizado para fechas
  private dateRangeValidator(form: FormGroup) {
    const initDate = form.get('initDate')?.value;
    const endDate = form.get('endDate')?.value;

    if (initDate && endDate) {
      const start = new Date(initDate);
      const end = new Date(endDate);
      
      if (end <= start) {
        return { dateRangeInvalid: true };
      }
    }
    return null;
  }

  cargarClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (clientes) => {
        // Filtrar solo clientes activos
        this.clientes = clientes.filter(cliente => cliente.status);
        console.log('Clientes activos cargados:', this.clientes);
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        this.showError('Error al cargar la lista de clientes');
      }
    });
  }

  cargarClienteEspecifico(clienteId: number): void {
    this.clienteService.getCliente(clienteId).subscribe({
      next: (cliente) => {
        this.clienteSeleccionado = cliente;
        if (cliente.status) {
          this.polizaForm.patchValue({
            idClient: cliente.id
          });
        } else {
          this.showError('El cliente seleccionado no está activo');
        }
      },
      error: (error) => {
        console.error('Error al cargar cliente específico:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.polizaForm.valid) {
      this.isLoading = true;

      const formData = this.polizaForm.value;
      
      // Preparar los datos con la estructura correcta
      const polizaData: Poliza = {
        folio: { value: formData.folio },
        idTypePolicy: formData.idTypePolicy,
        initDate: new Date(formData.initDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        insuredAmount: parseFloat(formData.insuredAmount),
        idClient: formData.idClient,
        status: formData.status
      };

      console.log('Enviando datos de póliza:', polizaData);

      this.polizaService.createPoliza(polizaData).subscribe({
        next: (poliza) => {
          this.isLoading = false;
          this.showSuccess('Póliza creada exitosamente');
          console.log('Póliza creada:', poliza);
          
          // Redirigir según el contexto
          if (this.clienteIdFromUrl) {
            this.router.navigate(['/polizas'], { queryParams: { clienteId: this.clienteIdFromUrl } });
          } else {
            this.router.navigate(['/polizas']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.showError('Error al crear la póliza: ' + (error.message || 'Error desconocido'));
          console.error('Error al crear póliza:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    // Redirigir según el contexto
    if (this.clienteIdFromUrl) {
      this.router.navigate(['/polizas'], { queryParams: { clienteId: this.clienteIdFromUrl } });
    } else {
      this.router.navigate(['/polizas']);
    }
  }

  // Cuando cambia la fecha de inicio, ajustar fecha fin mínima
  onInitDateChange(): void {
    const initDate = this.polizaForm.get('initDate')?.value;
    if (initDate) {
      const minEndDate = new Date(initDate);
      minEndDate.setDate(minEndDate.getDate() + 1); // Mínimo 1 día después
      
      const currentEndDate = this.polizaForm.get('endDate')?.value;
      if (currentEndDate && new Date(currentEndDate) <= new Date(initDate)) {
        this.polizaForm.patchValue({ endDate: null });
      }
    }
  }

  // Calcular días de vigencia
  calcularDiasVigencia(): number {
    const initDate = this.polizaForm.get('initDate')?.value;
    const endDate = this.polizaForm.get('endDate')?.value;

    if (initDate && endDate) {
      const start = new Date(initDate);
      const end = new Date(endDate);
      const diferenciaMs = end.getTime() - start.getTime();
      return Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
    }
    return 0;
  }

  // Obtener nombre del cliente seleccionado
  getNombreCliente(id: number): string {
    const cliente = this.clientes.find(c => c.id === id);
    return cliente ? cliente.fullname : 'Cliente no encontrado';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.polizaForm.controls).forEach(key => {
      const control = this.polizaForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
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

  getMinEndDate(): Date {
  const initDateValue = this.polizaForm.get('initDate')?.value;
  if (initDateValue) {
    const minDate = new Date(initDateValue);
    minDate.setDate(minDate.getDate() + 1); // Mínimo 1 día después
    return minDate;
  }
  return this.minDate;
}
  // Getters para acceder fácilmente a los controles del formulario
  get folio() { return this.polizaForm.get('folio'); }
  get idTypePolicy() { return this.polizaForm.get('idTypePolicy'); }
  get initDate() { return this.polizaForm.get('initDate'); }
  get endDate() { return this.polizaForm.get('endDate'); }
  get insuredAmount() { return this.polizaForm.get('insuredAmount'); }
  get idClient() { return this.polizaForm.get('idClient'); }
  get status() { return this.polizaForm.get('status'); }
}