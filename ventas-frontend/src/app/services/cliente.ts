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
    { id: 2, nombre: 'María López', email: 'maria@email.com', telefono: '988777666', direccion: 'Calle Los Olivos 456' },
    { id: 3, nombre: 'Carlos Gómez', email: 'carlos@email.com', telefono: '977666555', direccion: 'Jr. Las Flores 789' }
  ];
  private nextId = 4;

  listar(): Observable<Cliente[]> {
    console.log('👤 ClienteService.listar() - Enviando clientes:', this.clientes);
    return of([...this.clientes]).pipe(delay(300));
  }

  crear(cliente: Cliente): Observable<Cliente> {
    const nuevo = { ...cliente, id: this.nextId++ };
    this.clientes.push(nuevo);
    return of(nuevo).pipe(delay(300));
  }
}