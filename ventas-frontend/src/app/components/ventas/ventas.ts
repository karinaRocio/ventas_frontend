import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { VentaService } from '../../services/venta';
import { ClienteService } from '../../services/cliente';
import { ProductoService } from '../../services/producto';
import { AuthService } from '../../services/auth';
import { Venta, DetalleVenta } from '../../models/venta';
import { Cliente } from '../../models/cliente';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  private ventaService = inject(VentaService);
  private clienteService = inject(ClienteService);
  private productoService = inject(ProductoService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ventas: Venta[] = [];
  clientes: Cliente[] = [];
  productos: Producto[] = [];
  totalVentas: number = 0;
  resumen: any = null;

  venta: Venta = {
    cliente: { nombre: '', email: '', telefono: '', direccion: '' },
    total: 0,
    estado: 'COMPLETADA',
    detalles: []
  };

  clienteSeleccionado: number = 0;
  productoSeleccionado: number = 0;
  cantidadDetalle: number = 1;
  mensaje: string = '';

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargarVentas();
    this.cargarClientes();
    this.cargarProductos();
    this.calcularTotalVentas();
  }

  cargarVentas(): void {
    this.ventaService.listar().subscribe({
      next: (data) => {
        this.ventas = data;
      },
      error: (err) => {
        console.error('Error al cargar ventas:', err);
      }
    });
  }

  cargarClientes(): void {
    this.clienteService.listar().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
      }
    });
  }

  cargarProductos(): void {
    this.productoService.listar().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }

  calcularTotalVentas(): void {
    this.ventaService.getTotalVentas().subscribe({
      next: (data) => {
        this.totalVentas = data.total;
      },
      error: (err) => {
        console.error('Error al calcular total:', err);
      }
    });
  }

  verResumen(id: number): void {
    this.ventaService.obtenerResumen(id).subscribe({
      next: (data) => {
        this.resumen = data;
        setTimeout(() => this.resumen = null, 5000);
      },
      error: (err) => {
        console.error('Error al obtener resumen:', err);
      }
    });
  }

  agregarDetalle(): void {
    const producto = this.productos.find(p => p.id === this.productoSeleccionado);
    if (!producto) return;

    const detalle: DetalleVenta = {
      producto: producto,
      cantidad: this.cantidadDetalle,
      precioUnitario: producto.precio,
      subtotal: producto.precio * this.cantidadDetalle
    };

    this.venta.detalles.push(detalle);
    this.venta.total = this.venta.detalles.reduce((sum, d) => sum + d.subtotal, 0);
    
    // Resetear selección
    this.productoSeleccionado = 0;
    this.cantidadDetalle = 1;
  }

  eliminarDetalle(index: number): void {
    this.venta.detalles.splice(index, 1);
    this.venta.total = this.venta.detalles.reduce((sum, d) => sum + d.subtotal, 0);
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.mensaje = '❌ Complete todos los campos';
      return;
    }

    if (this.venta.detalles.length === 0) {
      this.mensaje = '❌ Agregue al menos un producto';
      return;
    }

    const cliente = this.clientes.find(c => c.id === this.clienteSeleccionado);
    if (!cliente) {
      this.mensaje = '❌ Seleccione un cliente';
      return;
    }

    this.venta.cliente = cliente;

    // Enviar la venta al backend
    this.ventaService.crear(this.venta).subscribe({
      next: (response) => {
        this.mensaje = '✅ Venta creada exitosamente!';
        this.venta = {
          cliente: { nombre: '', email: '', telefono: '', direccion: '' },
          total: 0,
          estado: 'COMPLETADA',
          detalles: []
        };
        this.clienteSeleccionado = 0;
        this.cargarDatos();
        form.reset();
        setTimeout(() => this.mensaje = '', 3000);
      },
      error: (err) => {
        this.mensaje = '❌ Error al crear la venta: ' + (err.error?.error || err.message);
        console.error('Error:', err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}