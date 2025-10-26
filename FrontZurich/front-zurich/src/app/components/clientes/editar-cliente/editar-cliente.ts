import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Cliente } from '../../../models/cliente';
import { ClienteService } from '../../../services/cliente.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-editar-cliente',
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
    MatCheckboxModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './editar-cliente.html',
  styleUrls: ['./editar-cliente.css']
})
export class EditarClienteComponent implements OnInit {
  clienteForm: FormGroup;
  isLoading = false;
  isloadingCliente = true;
  clienteId: number;
  cliente: Cliente | null = null;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.clienteForm = this.createForm();
    this.clienteId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/polizas']);
      return;
    }

    this.cargarCliente();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]{10,15}$/)]],
      identificationNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,13}$/)]],
      status: [true]
    });
  }

  cargarCliente(): void {
    this.isloadingCliente = true;
    
    this.clienteService.getCliente(this.clienteId).subscribe({
      next: (cliente) => {
        this.cliente = cliente;
        this.patchFormValues(cliente);
        this.isloadingCliente = false;
        console.log('Cliente cargado para edición:', cliente);
      },
      error: (error) => {
        this.isloadingCliente = false;
        this.showError('Error al cargar el cliente: ' + (error.message || 'Error desconocido'));
        console.error('Error al cargar cliente:', error);
        this.router.navigate(['/clientes']);
      }
    });
  }

  private patchFormValues(cliente: Cliente): void {
    this.clienteForm.patchValue({
      fullname: cliente.fullname,
      email: cliente.email.value, // Extraer el valor del objeto email
      phone: cliente.phone,
      identificationNumber: cliente.identificationNumber,
      status: cliente.status
    });
  }

  onSubmit(): void {
    if (this.clienteForm.valid && this.cliente) {
      this.isLoading = true;

      const formData = this.clienteForm.value;
      const clienteData: Cliente = {
        ...this.cliente,
        fullname: formData.fullname,
        email: { value: formData.email }, // Mantener la estructura de objeto
        phone: formData.phone,
        identificationNumber: formData.identificationNumber,
        status: formData.status
      };

      console.log('Enviando datos actualizados:', clienteData);

      this.clienteService.updateCliente(this.clienteId, clienteData).subscribe({
        next: (cliente) => {
          this.isLoading = false;
          this.showSuccess('Cliente actualizado exitosamente');
          console.log('Cliente actualizado:', cliente);
          this.router.navigate(['/clientes']);
        },
        error: (error) => {
          this.isLoading = false;
          this.showError('Error al actualizar el cliente: ' + (error.message || 'Error desconocido'));
          console.error('Error al actualizar cliente:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/clientes']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.clienteForm.controls).forEach(key => {
      const control = this.clienteForm.get(key);
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

  // Getters para acceder fácilmente a los controles del formulario
  get fullname() { return this.clienteForm.get('fullname'); }
  get email() { return this.clienteForm.get('email'); }
  get phone() { return this.clienteForm.get('phone'); }
  get identificationNumber() { return this.clienteForm.get('identificationNumber'); }
  get status() { return this.clienteForm.get('status'); }
}