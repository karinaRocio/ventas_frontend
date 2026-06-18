import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta } from '../models/venta';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:8081/api/ventas';

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  listar(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  crear(venta: Venta): Observable<Venta> {
    return this.http.post<Venta>(this.apiUrl, venta, { headers: this.getHeaders() });
  }

  obtener(id: number): Observable<Venta> {
    return this.http.get<Venta>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  obtenerResumen(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/resumen`, { headers: this.getHeaders() });
  }

  getTotalVentas(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(`${this.apiUrl}/total-ventas`, { headers: this.getHeaders() });
  }

  obtenerPorCliente(clienteId: number): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.apiUrl}/cliente/${clienteId}`, { headers: this.getHeaders() });
  }
}
