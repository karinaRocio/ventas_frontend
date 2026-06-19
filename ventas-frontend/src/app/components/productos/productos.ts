import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoService } from '../../services/producto';
import { AuthService } from '../../services/auth';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css']
})
export class ProductosComponent implements OnInit {
  private productoService = inject(ProductoService);
  public authService = inject(AuthService);
  private router = inject(Router);

  productos: Producto[] = [];
  producto: Producto = { nombre: '', precio: 0, stock: 0 };
  editando: boolean = false;
  productoId: number | null = null;
  mensaje: string = '';

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.listar().subscribe({
      next: (data: Producto[]) => { this.productos = data; },
      error: (err: any) => { console.error(err); }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    if (this.editando && this.productoId) {
      this.productoService.actualizar(this.productoId, this.producto).subscribe({
        next: () => {
          this.mensaje = '✅ Producto actualizado';
          this.cancelarEdicion();
          this.cargarProductos();
          setTimeout(() => this.mensaje = '', 3000);
        },
        error: (err: any) => { this.mensaje = '❌ Error al actualizar'; }
      });
    } else {
      this.productoService.crear(this.producto).subscribe({
        next: () => {
          this.mensaje = '✅ Producto creado';
          this.producto = { nombre: '', precio: 0, stock: 0 };
          this.cargarProductos();
          form.reset();
          setTimeout(() => this.mensaje = '', 3000);
        },
        error: (err: any) => { this.mensaje = '❌ Error al crear'; }
      });
    }
  }

  editar(producto: Producto): void {
    this.producto = { ...producto };
    this.editando = true;
    this.productoId = producto.id || null;
  }

  eliminar(id: number): void {
    if (confirm('¿Eliminar este producto?')) {
      this.productoService.eliminar(id).subscribe({
        next: () => {
          this.mensaje = '✅ Producto eliminado';
          this.cargarProductos();
          setTimeout(() => this.mensaje = '', 3000);
        },
        error: (err: any) => { this.mensaje = '❌ Error al eliminar'; }
      });
    }
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.productoId = null;
    this.producto = { nombre: '', precio: 0, stock: 0 };
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}