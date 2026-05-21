import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Perfil } from '../../models/usuario.model';
import { ToastService } from '../../services/toast.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css'],
})
export class PerfilComponent implements OnInit {
  private readonly service = inject(UsuarioService);
  private readonly toast = inject(ToastService);
  perfil?: Perfil;

  ngOnInit(): void {
    this.service.getPerfil().subscribe({
      next: (p) => this.perfil = p,
      error: (error: HttpErrorResponse) => this.toast.showError(error.error?.mensaje || 'No se pudo cargar el perfil'),
    });
  }

  save(): void {
    if (!this.perfil) return;
    this.service.updatePerfil(this.perfil).subscribe({
      next: (p) => { this.perfil = p; this.toast.showSuccess('Perfil actualizado'); },
      error: (error: HttpErrorResponse) => this.toast.showError(error.error?.mensaje || 'No se pudo actualizar el perfil'),
    });
  }

  puedeEditarDatos(): boolean {
    return !!(this.perfil?.nombres || this.perfil?.apellidos || this.perfil?.email || this.perfil?.telefono || this.perfil?.rol !== 'ROLE_ADMIN');
  }

  nombreCompleto(): string {
    const nombres = [this.perfil?.nombres, this.perfil?.apellidos].filter(Boolean).join(' ').trim();
    return nombres || this.perfil?.username || 'Usuario';
  }

  iniciales(): string {
    const base = this.nombreCompleto().split(' ').filter(Boolean);
    return (base[0]?.[0] || 'U').toUpperCase() + (base[1]?.[0] || '').toUpperCase();
  }

  rolLabel(rol: string): string {
    if (rol === 'ROLE_ADMIN') return 'Administrador';
    if (rol === 'ROLE_TRABAJADOR') return 'Trabajador';
    return 'Adoptante';
  }
}
