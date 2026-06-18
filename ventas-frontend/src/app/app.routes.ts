import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { ProductosComponent } from './components/productos/productos';
import { ClientesComponent } from './components/clientes/clientes';
import { VentasComponent } from './components/ventas/ventas';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Iniciar Sesión' },
  { path: 'productos', component: ProductosComponent, title: 'Productos' },
  { path: 'clientes', component: ClientesComponent, title: 'Clientes' },
  { path: 'ventas', component: VentasComponent, title: 'Ventas' },
  { path: '**', redirectTo: '/login' }  // Ruta para páginas no encontradas
];