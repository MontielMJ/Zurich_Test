import { Routes } from '@angular/router';
import { ListaClientesComponent } from './components/clientes/lista-clientes/lista-clientes';
import { EditarClienteComponent } from './components/clientes/editar-cliente/editar-cliente';
import { ListaPolizasComponent } from './components/polizas/lista-polizas/lista-polizas';
import { CrearPolizaComponent } from './components/polizas/crear-poliza/crear-poliza';
import { EditarPolizaComponent } from './components/polizas/editar-poliza/editar-poliza';
import { CrearClienteComponent } from './components/clientes/crear-cliente/crear-cliente';
import { LoginComponent } from './components/login/login';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard'; 

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'clientes', component: ListaClientesComponent, canActivate: [authGuard,roleGuard]},
  { path: 'clientes/crear', component: CrearClienteComponent,  canActivate: [authGuard,roleGuard]},
  { path: 'clientes/editar/:id', component: EditarClienteComponent, canActivate: [authGuard,roleGuard], data:{role:'Admin'}  },
  { path: 'polizas', component: ListaPolizasComponent, canActivate: [authGuard]  },
  { path: 'polizas/crear', component: CrearPolizaComponent, canActivate: [authGuard]  },
  { path: 'polizas/editar/:id', component: EditarPolizaComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];