import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
import { Cliente } from '../../../models/cliente';
import { ClienteService } from '../../../services/cliente.service';
import { AuthService } from '../../../services/auth.service';
import { MatSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-crear-cliente',
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
    MatSpinner
  ],
  templateUrl: './crear-cliente.html',
  styleUrls: ['./crear-cliente.css']
})
export class CrearClienteComponent implements OnInit {
  clienteForm: FormGroup;
  isLoading = false;
  isEditMode = false;
  clienteId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.clienteForm = this.createForm();
  }

  ngOnInit(): void {
    // Verificar si el usuario tiene acceso (solo admin)
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/polizas']);
      return;
    }
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

  onSubmit(): void {
    if (this.clienteForm.valid) {
      this.isLoading = true;

      const clienteData: Cliente = {
        ...this.clienteForm.value,
        createAt: new Date() // Fecha de creación automática
      };

      this.clienteService.createCliente(clienteData).subscribe({
        next: (cliente) => {
          this.isLoading = false;
          this.showSuccess('Cliente creado exitosamente');
          console.log('Cliente creado:', cliente);
          this.router.navigate(['/clientes']);
        },
        error: (error) => {
          this.isLoading = false;
          this.showError('Error al crear el cliente: ' + (error.message || 'Error desconocido'));
          console.error('Error al crear cliente:', error);
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