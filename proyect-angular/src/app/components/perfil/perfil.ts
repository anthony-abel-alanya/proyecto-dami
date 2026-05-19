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
  template: `
    <div class="page-head">
      <div>
        <h1>Mi Perfil</h1>
        <p>Informacion de la cuenta operativa.</p>
      </div>
    </div>

    @if (perfil) {
      <section class="profile-grid">
        <aside class="profile-card">
          <div class="avatar-lg">{{ iniciales() }}</div>
          <h2>{{ nombreCompleto() }}</h2>
          <p>{{ rolLabel(perfil.rol) }}</p>
          <div class="profile-meta">
            <div><span>Usuario</span><strong>{{ perfil.username }}</strong></div>
            <div><span>DNI</span><strong>{{ perfil.dni || '-' }}</strong></div>
            <div><span>Correo</span><strong>{{ perfil.email || 'Sin correo' }}</strong></div>
            <div><span>Telefono</span><strong>{{ perfil.telefono || 'Sin telefono' }}</strong></div>
            <div><span>Estado</span><strong>Activo</strong></div>
          </div>
        </aside>

        <section class="panel profile-form">
          <div class="section-head">
            <div>
              <h2>Datos personales</h2>
              <p>Actualiza la informacion visible para la gestion interna.</p>
            </div>
          </div>

          @if (puedeEditarDatos()) {
            <div class="form-grid compact">
              <label>Nombres<input class="form-control" [(ngModel)]="perfil.nombres"></label>
              <label>Apellidos<input class="form-control" [(ngModel)]="perfil.apellidos"></label>
              <label>Email<input class="form-control" [(ngModel)]="perfil.email"></label>
              <label>Tel&eacute;fono<input class="form-control" [(ngModel)]="perfil.telefono"></label>
              @if (perfil.rol === 'ROLE_ADOPTANTE') {
                <label class="span-2">Direcci&oacute;n<input class="form-control" [(ngModel)]="perfil.direccion"></label>
              }
            </div>
            <div class="actions">
              <button class="btn btn-primary" (click)="save()">Guardar cambios</button>
            </div>
          } @else {
            <div class="alert alert-info mb-0">Esta cuenta no tiene una ficha personal asociada.</div>
          }
        </section>
      </section>
    } @else {
      <section class="panel"><p class="text-muted mb-0">Cargando perfil...</p></section>
    }
  `,
  styles: [`
    .profile-grid {
      display: grid;
      grid-template-columns: 330px 1fr;
      gap: 18px;
      align-items: start;
    }
    .profile-card {
      background: #fff;
      border: 1px solid #e1e7ef;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 10px 22px rgba(25, 42, 70, .06);
    }
    .avatar-lg {
      width: 82px;
      height: 82px;
      display: grid;
      place-items: center;
      border-radius: 8px;
      background: #1a56a0;
      color: #fff;
      font-size: 28px;
      font-weight: 800;
      margin-bottom: 18px;
    }
    .profile-card h2 {
      margin: 0 0 4px;
      font-size: 22px;
    }
    .profile-card p {
      margin: 0 0 20px;
      color: #68768a;
    }
    .profile-meta {
      display: grid;
      gap: 10px;
    }
    .profile-meta div {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 12px;
      background: #f7fafc;
      border: 1px solid #edf1f6;
      border-radius: 8px;
    }
    .profile-meta span,
    .section-head p {
      color: #68768a;
    }
    .profile-meta strong {
      text-align: right;
      color: #15253a;
    }
    .profile-form { margin-bottom: 0; }
    .section-head {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 18px;
    }
    .section-head h2,
    .section-head p { margin: 0; }
    .compact { margin-bottom: 18px; }
    @media (max-width: 900px) {
      .profile-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
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
