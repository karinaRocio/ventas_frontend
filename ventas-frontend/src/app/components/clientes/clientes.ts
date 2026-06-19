import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from '../../services/cliente';
import { AuthService } from '../../services/auth';
import { Cliente } from '../../models/cliente';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrls: ['./clientes.css']
})
export class ClientesComponent implements OnInit {
  private clienteService = inject(ClienteService);
  public authService = inject(AuthService);
  private router = inject(Router);

  clientes: Cliente[] = [];
  cliente: Cliente = { nombre: '', email: '', telefono: '', direccion: '' };
  mensaje: string = '';

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.clienteService.listar().subscribe({
      next: (data: Cliente[]) => {
        this.clientes = data;
        console.log('Clientes cargados:', data);
      },
      error: (err: any) => {
        console.error('Error al cargar clientes:', err);
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.mensaje = '❌ Complete todos los campos';
      return;
    }

    console.log('Guardando cliente:', this.cliente);

    this.clienteService.crear(this.cliente).subscribe({
      next: (nuevoCliente: Cliente) => {
        this.mensaje = '✅ Cliente creado exitosamente!';
        this.cliente = { nombre: '', email: '', telefono: '', direccion: '' };
        this.cargarClientes();
        form.reset();
        setTimeout(() => this.mensaje = '', 3000);
      },
      error: (err: any) => {
        this.mensaje = '❌ Error al crear cliente';
        console.error('Error:', err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}