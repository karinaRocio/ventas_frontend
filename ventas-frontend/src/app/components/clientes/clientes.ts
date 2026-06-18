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
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private authService = inject(AuthService);
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
      next: (data) => {
        this.clientes = data;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        if (err.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    this.clienteService.crear(this.cliente).subscribe({
      next: () => {
        this.mensaje = '✅ Cliente creado';
        this.cliente = { nombre: '', email: '', telefono: '', direccion: '' };
        this.cargarClientes();
        form.reset();
        setTimeout(() => this.mensaje = '', 3000);
      },
      error: (err) => {
        this.mensaje = '❌ Error al crear cliente';
        console.error(err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
