import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  loginError: string = '';
  isRegistering: boolean = false;

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    const { email, password, nombre } = form.value;

    if (this.isRegistering) {
      // Registro
      this.authService.register({ email, nombre, password }).subscribe({
        next: (response) => {
          alert('Usuario registrado exitosamente');
          this.isRegistering = false;
          form.reset();
        },
        error: (err) => {
          this.loginError = err.error?.error || 'Error al registrar';
        }
      });
    } else {
      // Login
      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.authService.saveToken(response.token);
          this.authService.saveUser({ email: response.email, nombre: response.nombre });
          this.router.navigate(['/productos']);
        },
        error: (err) => {
          this.loginError = err.error?.error || 'Credenciales inválidas';
        }
      });
    }
  }

  toggleMode() {
    this.isRegistering = !this.isRegistering;
    this.loginError = '';
  }
}