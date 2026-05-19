import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  token: string;
  username: string;
  rol: string;
  id: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { username, password }).pipe(
      tap((response) => this.saveSession(response)),
    );
  }

  logout(redirect = true): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('rol');
    localStorage.removeItem('userId');
    if (redirect) {
      void this.router.navigate(['/login']);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getRol() === 'ROLE_ADMIN';
  }

  isTrabajador(): boolean {
    return this.getRol() === 'ROLE_TRABAJADOR';
  }

  canUseStaffPanel(): boolean {
    return this.isAdmin() || this.isTrabajador();
  }

  private saveSession(response: LoginResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('username', response.username);
    localStorage.setItem('rol', response.rol);
    localStorage.setItem('userId', String(response.id));
  }
}
