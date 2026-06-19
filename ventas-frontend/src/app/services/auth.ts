import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  private userKey = 'user';

  // Credenciales de prueba
  private readonly TEST_USER = {
    email: 'test@mail.com',
    password: '123456',
    nombre: 'Usuario Test'
  };

  login(email: string, password: string): Observable<any> {
    if (email === this.TEST_USER.email && password === this.TEST_USER.password) {
      return of({
        token: 'fake-jwt-token-simulado',
        email: email,
        nombre: this.TEST_USER.nombre
      }).pipe(delay(500));
    } else {
      return throwError(() => ({
        error: { error: 'Credenciales inválidas. Usa: test@mail.com / 123456' }
      }));
    }
  }

  register(usuario: Usuario): Observable<any> {
    return of({
      message: 'Usuario registrado exitosamente',
      email: usuario.email,
      nombre: usuario.nombre
    }).pipe(delay(500));
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  saveUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }
}