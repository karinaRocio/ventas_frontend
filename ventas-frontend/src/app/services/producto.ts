import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private productos: Producto[] = [
    { id: 1, nombre: '💻 Laptop Gamer Victus 15', precio: 3099, stock: 8 },
    { id: 2, nombre: '🖱️ Mouse Logitech G203 RGB', precio: 119, stock: 25 },
    { id: 3, nombre: '📱 Samsung Galaxy S24 Ultra', precio: 3799, stock: 5 },
    { id: 4, nombre: '🎧 JBL Auriculares Tour Pro 3', precio: 1399, stock: 12 },
    { id: 5, nombre: '🎵 JBL Audífonos Tune 720 BT', precio: 189, stock: 20 },
    { id: 6, nombre: '🖥️ Monitor Samsung 24" FHD', precio: 849, stock: 15 },
    { id: 7, nombre: '⌨️ Teclado Mecánico RGB', precio: 159, stock: 30 },
    { id: 8, nombre: '💾 SSD 1TB Kingston', precio: 349, stock: 18 },
    { id: 9, nombre: '📷 Webcam HD Logitech', precio: 129, stock: 10 },
    { id: 10, nombre: '🔊 Parlante Bluetooth JBL', precio: 299, stock: 14 }
  ];
  private nextId = 11;

  listar(): Observable<Producto[]> {
    console.log('📤 ProductoService.listar() - Enviando productos:', this.productos);
    return of([...this.productos]).pipe(delay(300));
  }

  obtener(id: number): Observable<Producto> {
    const producto = this.productos.find(p => p.id === id);
    return of({ ...producto! }).pipe(delay(200));
  }

  crear(producto: Producto): Observable<Producto> {
    const nuevo = { ...producto, id: this.nextId++ };
    this.productos.push(nuevo);
    return of(nuevo).pipe(delay(300));
  }

  actualizar(id: number, producto: Producto): Observable<Producto> {
    const index = this.productos.findIndex(p => p.id === id);
    if (index !== -1) {
      this.productos[index] = { ...producto, id };
    }
    return of(this.productos[index]).pipe(delay(300));
  }

  eliminar(id: number): Observable<void> {
    this.productos = this.productos.filter(p => p.id !== id);
    return of(undefined).pipe(delay(300));
  }
}