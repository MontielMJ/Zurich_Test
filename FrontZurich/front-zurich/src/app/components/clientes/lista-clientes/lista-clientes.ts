import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Cliente } from '../../../models/cliente';
import { ClienteService } from '../../../services/cliente.service';
import { AuthService } from '../../../services/auth.service';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';

@Component({
  selector: 'app-lista-clientes',
  templateUrl: 'lista-clientes.html',
  styleUrls: ['lista-clientes.css'],
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardHeader,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatChipsModule
  ]
})
export class ListaClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clienteSeleccionado: Cliente | null = null;
  isAdmin = false;
  hasAccess = true;

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.isAdmin = this.authService.isAdmin();
    this.hasAccess = this.isAdmin;

    if (!this.hasAccess) {
      console.warn('Usuario no tiene acceso a la gestión de clientes');
      return;
    }
    this.cargarClientes();
  }

  cargarClientes(): void {
    if (!this.hasAccess) return;
    
    this.clienteService.getClientes().subscribe({
      next: (clientes) => {
        console.log('Clientes cargados:', clientes);
        this.clientes = clientes;
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
      }
    });
  }

  eliminarCliente(id: number): void {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      this.clienteService.deleteCliente(id).subscribe({
        next: () => {
          this.cargarClientes();
        },
        error: (error) => {
          console.error('Error al eliminar cliente:', error);
        }
      });
    }
  }

  seleccionarCliente(cliente: Cliente): void {
    this.clienteSeleccionado = cliente;
  }
}