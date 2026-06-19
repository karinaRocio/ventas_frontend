import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { ProductosComponent } from './components/productos/productos';
import { ClientesComponent } from './components/clientes/clientes';
import { VentasComponent } from './components/ventas/ventas';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'ventas', component: VentasComponent },
  { path: '**', redirectTo: '/login' }
];