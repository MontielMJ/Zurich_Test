import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };

  isLoading = false;
  hidePassword = true;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Si ya está logueado, redirigir a clientes
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/clientes']);
    }
  }

  onLogin(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Validación básica
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Por favor complete todos los campos';
      this.isLoading = false;
      return;
    }

    if (this.credentials.password.length < 4) {
      this.errorMessage = 'La contraseña debe tener al menos 4 caracteres';
      this.isLoading = false;
      return;
    }

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Login exitoso, respuesta:', response);
        const token = this.authService.getToken();
        if (token) {
          this.router.navigate(['/clientes']);
        } else {
          this.errorMessage = 'Error al guardar la sesión';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Error en el inicio de sesión';
        console.error('Error en login:', error);
        if (error.message.includes('CORS')) {
          console.error('Posible problema de CORS. Verifica la configuración del backend.');
        }
      }
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  fillDemoCredentials(): void {
    this.credentials.username = 'jmontiel'; 
    this.credentials.password = '123456';
  }
}