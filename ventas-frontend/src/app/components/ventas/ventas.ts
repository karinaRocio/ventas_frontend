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
  templateUrl: './ventas.html',
  styleUrls: ['./ventas.css']
})
export class VentasComponent implements OnInit {
  private ventaService = inject(VentaService);
  private clienteService = inject(ClienteService);
  private productoService = inject(ProductoService);
  public authService = inject(AuthService);
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
      next: (data: Venta[]) => {
        this.ventas = data;
        console.log('📋 Ventas cargadas:', data);
      },
      error: (err: any) => console.error('Error al cargar ventas:', err)
    });
  }

  cargarClientes(): void {
    this.clienteService.listar().subscribe({
      next: (data: Cliente[]) => {
        this.clientes = data;
        console.log('👥 Clientes cargados:', data);
      },
      error: (err: any) => console.error('Error al cargar clientes:', err)
    });
  }

  cargarProductos(): void {
    console.log('📦 Cargando productos...');
    this.productoService.listar().subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
        console.log('✅ Productos cargados en ventas:', this.productos);
      },
      error: (err: any) => console.error('❌ Error al cargar productos:', err)
    });
  }

  calcularTotalVentas(): void {
    this.ventaService.getTotalVentas().subscribe({
      next: (data: any) => {
        this.totalVentas = data.total;
      },
      error: (err: any) => console.error(err)
    });
  }

  verResumen(id: number): void {
    this.ventaService.obtenerResumen(id).subscribe({
      next: (data: any) => {
        this.resumen = data;
        setTimeout(() => this.resumen = null, 5000);
      },
      error: (err: any) => console.error(err)
    });
  }

  agregarDetalle(): void {
    console.log('🔍 Intentando agregar detalle...');
    console.log('Producto seleccionado ID:', this.productoSeleccionado);
    console.log('Productos disponibles:', this.productos);

    if (this.productoSeleccionado === 0) {
      this.mensaje = '⚠️ Seleccione un producto';
      setTimeout(() => this.mensaje = '', 3000);
      return;
    }

    const idProducto = Number(this.productoSeleccionado);
    const producto = this.productos.find(p => p.id === idProducto);
    
    if (!producto) {
      console.warn('⚠️ Producto no encontrado con ID:', idProducto);
      this.mensaje = '❌ Producto no encontrado';
      setTimeout(() => this.mensaje = '', 3000);
      return;
    }

    console.log('✅ Producto encontrado:', producto);

    if (this.cantidadDetalle < 1) {
      this.mensaje = '⚠️ La cantidad debe ser mayor a 0';
      setTimeout(() => this.mensaje = '', 3000);
      return;
    }

    if (producto.stock < this.cantidadDetalle) {
      this.mensaje = `⚠️ Stock insuficiente. Disponible: ${producto.stock}`;
      setTimeout(() => this.mensaje = '', 3000);
      return;
    }

    const detalle: DetalleVenta = {
      producto: producto,
      cantidad: this.cantidadDetalle,
      precioUnitario: producto.precio,
      subtotal: producto.precio * this.cantidadDetalle
    };

    this.venta.detalles.push(detalle);
    this.venta.total = this.venta.detalles.reduce((sum, d) => sum + d.subtotal, 0);

    console.log('📋 Detalles actuales:', this.venta.detalles);
    console.log('💰 Total venta:', this.venta.total);

    this.productoSeleccionado = 0;
    this.cantidadDetalle = 1;
    
    this.mensaje = `✅ Producto agregado: ${producto.nombre}`;
    setTimeout(() => this.mensaje = '', 2000);
  }

  eliminarDetalle(index: number): void {
    this.venta.detalles.splice(index, 1);
    this.venta.total = this.venta.detalles.reduce((sum, d) => sum + d.subtotal, 0);
    this.mensaje = '🗑️ Producto eliminado';
    setTimeout(() => this.mensaje = '', 2000);
  }

  onSubmit(form: NgForm): void {
    console.log('📝 Enviando formulario...');
    console.log('Cliente seleccionado ID:', this.clienteSeleccionado);
    console.log('Clientes disponibles:', this.clientes);

    if (form.invalid) {
      this.mensaje = '⚠️ Complete todos los campos';
      setTimeout(() => this.mensaje = '', 3000);
      return;
    }

    if (this.venta.detalles.length === 0) {
      this.mensaje = '⚠️ Agregue al menos un producto';
      setTimeout(() => this.mensaje = '', 3000);
      return;
    }

    if (this.clienteSeleccionado === 0) {
      this.mensaje = '⚠️ Seleccione un cliente';
      setTimeout(() => this.mensaje = '', 3000);
      return;
    }

    // ✅ CONVERTIR A NUMBER PARA COMPARAR CORRECTAMENTE
    const idCliente = Number(this.clienteSeleccionado);
    
    // Buscar el cliente seleccionado
    const cliente = this.clientes.find(c => c.id === idCliente);
    
    if (!cliente) {
      console.warn('⚠️ Cliente no encontrado con ID:', idCliente);
      console.log('IDs disponibles:', this.clientes.map(c => c.id));
      this.mensaje = '❌ Cliente no encontrado. Seleccione un cliente válido.';
      setTimeout(() => this.mensaje = '', 3000);
      return;
    }

    console.log('✅ Cliente encontrado:', cliente);

    // Asignar el cliente a la venta
    this.venta.cliente = cliente;

    // Registrar la venta
    this.ventaService.crear(this.venta).subscribe({
      next: (nuevaVenta: Venta) => {
        this.mensaje = `✅ Venta #${nuevaVenta.id} registrada! Total: S/ ${nuevaVenta.total}`;
        
        // Resetear formulario
        this.venta = {
          cliente: { nombre: '', email: '', telefono: '', direccion: '' },
          total: 0,
          estado: 'COMPLETADA',
          detalles: []
        };
        this.clienteSeleccionado = 0;
        this.cargarDatos();
        form.reset();
        setTimeout(() => this.mensaje = '', 4000);
      },
      error: (err: any) => {
        this.mensaje = '❌ Error al crear la venta';
        console.error(err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}