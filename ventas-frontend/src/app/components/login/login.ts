import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
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
      this.authService.register({ email, nombre, password }).subscribe({
        next: (response: any) => {
          alert('✅ ' + response.message);
          this.isRegistering = false;
          form.reset();
        },
        error: (err: any) => {
          this.loginError = err.error?.error || 'Error al registrar';
        }
      });
    } else {
      this.authService.login(email, password).subscribe({
        next: (response: any) => {
          this.authService.saveToken(response.token);
          this.authService.saveUser({ email: response.email, nombre: response.nombre });
          this.router.navigate(['/productos']);
        },
        error: (err: any) => {
          this.loginError = err.error?.error || 'Credenciales inválidas. Usa: test@mail.com / 123456';
        }
      });
    }
  }

  toggleMode() {
    this.isRegistering = !this.isRegistering;
    this.loginError = '';
  }
}