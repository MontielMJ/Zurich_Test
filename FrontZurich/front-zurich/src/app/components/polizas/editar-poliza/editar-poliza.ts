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
import { Poliza } from '../../../models/poliza';
import { PolizaService } from '../../../services/poliza.service';
import { AuthService } from '../../../services/auth.service';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-editar-poliza',
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
    MatChipsModule
  ],
  templateUrl: './editar-poliza.html',
  styleUrls: ['./editar-poliza.css']
})
export class EditarPolizaComponent implements OnInit {
  polizaForm: FormGroup;
  isLoading = false;
  isloadingPoliza = true;
  polizaId: number;
  poliza: Poliza | null = null;
  clientes: Cliente[] = [];

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
    this.minDate.setFullYear(this.minDate.getFullYear() - 1); // Permitir fechas hasta 1 año atrás
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() + 10); // 10 años máximo

    this.polizaForm = this.createForm();
    this.polizaId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.cargarPoliza();
    this.cargarClientes();
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

  cargarPoliza(): void {
    this.isloadingPoliza = true;
    
    this.polizaService.getPoliza(this.polizaId).subscribe({
      next: (poliza) => {
        this.poliza = poliza;
        this.patchFormValues(poliza);
        this.isloadingPoliza = false;
        console.log('Póliza cargada para edición:', poliza);
      },
      error: (error) => {
        this.isloadingPoliza = false;
        this.showError('Error al cargar la póliza: ' + (error.message || 'Error desconocido'));
        console.error('Error al cargar póliza:', error);
        this.router.navigate(['/polizas']);
      }
    });
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
      }
    });
  }

  private patchFormValues(poliza: Poliza): void {
    this.polizaForm.patchValue({
      id: poliza.id,
      folio: poliza.folio?.value || '',
      idTypePolicy: poliza.idTypePolicy,
      initDate: new Date(poliza.initDate),
      endDate: new Date(poliza.endDate),
      insuredAmount: poliza.insuredAmount,
      idClient: poliza.idClient,
      status: poliza.status
    });
  }

  onSubmit(): void {
    if (this.polizaForm.valid && this.poliza) {
      this.isLoading = true;

      const formData = this.polizaForm.value;
    
      const polizaData: Poliza = {
        ...this.poliza,
        folio: { value: formData.folio },
        idTypePolicy: formData.idTypePolicy,
        initDate: new Date(formData.initDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        insuredAmount: parseFloat(formData.insuredAmount),
        idClient: formData.idClient,
        status: formData.status,
        id: this.polizaId
      };

      console.log('Enviando datos actualizados de póliza:', polizaData);

      this.polizaService.updatePoliza(this.polizaId, polizaData).subscribe({
        next: (poliza) => {
          this.isLoading = false;
          this.showSuccess('Póliza actualizada exitosamente');
          console.log('Póliza actualizada:', poliza);
          this.router.navigate(['/polizas']);
        },
        error: (error) => {
          this.isLoading = false;
          this.showError('Error al actualizar la póliza: ' + (error.message || 'Error desconocido'));
          console.error('Error al actualizar póliza:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/polizas']);
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

  // Método para obtener la fecha mínima de fin
  getMinEndDate(): Date {
    const initDateValue = this.polizaForm.get('initDate')?.value;
    if (initDateValue) {
      const minDate = new Date(initDateValue);
      minDate.setDate(minDate.getDate() + 1); // Mínimo 1 día después
      return minDate;
    }
    return this.minDate;
  }

  // Método para formatear fecha de inicio para display
  getInitDateDisplay(): string {
    const initDateValue = this.polizaForm.get('initDate')?.value;
    if (initDateValue) {
      return new Date(initDateValue).toLocaleDateString('es-ES');
    }
    return '';
  }

  // Método para formatear fecha de fin para display
  getEndDateDisplay(): string {
    const endDateValue = this.polizaForm.get('endDate')?.value;
    if (endDateValue) {
      return new Date(endDateValue).toLocaleDateString('es-ES');
    }
    return '';
  }

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
  getNombreCliente(id: number): string {
    const cliente = this.clientes.find(c => c.id === id);
    return cliente ? cliente.fullname : 'Cliente no encontrado';
  }

  estaVencida(): boolean {
    if (!this.polizaForm.get('endDate')?.value || !this.polizaForm.get('status')?.value) {
      return false;
    }
    const fechaFin = new Date(this.polizaForm.get('endDate')?.value);
    const hoy = new Date();
    return fechaFin < hoy;
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

  get folio() { return this.polizaForm.get('folio'); }
  get idTypePolicy() { return this.polizaForm.get('idTypePolicy'); }
  get initDate() { return this.polizaForm.get('initDate'); }
  get endDate() { return this.polizaForm.get('endDate'); }
  get insuredAmount() { return this.polizaForm.get('insuredAmount'); }
  get idClient() { return this.polizaForm.get('idClient'); }
  get status() { return this.polizaForm.get('status'); }
  get idPolicy() { return this.polizaId; }
}