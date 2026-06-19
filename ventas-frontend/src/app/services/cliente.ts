import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private clientes: Cliente[] = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@email.com', telefono: '999888777', direccion: 'Av. Principal 123' },
    { id: 2, nombre: 'María López', email: 'maria@email.com', telefono: '988777666', direccion: 'Calle Los Olivos 456' }
  ];
  private nextId = 3;

  listar(): Observable<Cliente[]> {
    return of([...this.clientes]).pipe(delay(300));
  }

  crear(cliente: Cliente): Observable<Cliente> {
    const nuevo = { ...cliente, id: this.nextId++ };
    this.clientes.push(nuevo);
    return of(nuevo).pipe(delay(300));
  }
}