import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Venta } from '../models/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private ventas: Venta[] = [];
  private nextId = 1;

  listar(): Observable<Venta[]> {
    return of([...this.ventas]).pipe(delay(300));
  }

  crear(venta: Venta): Observable<Venta> {
    const nueva = { ...venta, id: this.nextId++, fecha: new Date().toISOString() };
    this.ventas.push(nueva);
    return of(nueva).pipe(delay(300));
  }

  obtenerResumen(id: number): Observable<any> {
    const venta = this.ventas.find(v => v.id === id);
    return of({
      ventaId: venta?.id,
      fecha: venta?.fecha,
      cliente: venta?.cliente.nombre,
      cantidadProductos: venta?.detalles.reduce((sum, d) => sum + d.cantidad, 0) || 0,
      total: venta?.total || 0,
      estado: venta?.estado
    }).pipe(delay(300));
  }

  getTotalVentas(): Observable<{ total: number }> {
    const total = this.ventas.reduce((sum, v) => sum + v.total, 0);
    return of({ total }).pipe(delay(300));
  }
}