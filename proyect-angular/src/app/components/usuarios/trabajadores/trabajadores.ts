import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Trabajador, UsuarioResumen } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';
import { ToastService } from '../../../services/toast.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-trabajadores',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page-head"><div><h1>Trabajadores</h1><p>Gestión de cuentas internas.</p></div><button class="btn btn-primary" (click)="showForm = !showForm">Nuevo Trabajador</button></div>
    @if (showForm) {
      <section class="panel form-grid">
        <input class="form-control" placeholder="Usuario" [(ngModel)]="form.username">
        <input class="form-control" placeholder="Password" type="password" [(ngModel)]="form.password">
        <input class="form-control" placeholder="Nombre" [(ngModel)]="form.nomTrabajador">
        <input class="form-control" placeholder="Apellido" [(ngModel)]="form.apeTrabajador">
        <input class="form-control" placeholder="DNI" [(ngModel)]="form.dni">
        <input class="form-control" type="date" [(ngModel)]="form.fecNacimiento">
        <input class="form-control" placeholder="Email" [(ngModel)]="form.email">
        <input class="form-control" placeholder="Telefono" [(ngModel)]="form.telefono">
        <button class="btn btn-primary" (click)="create()">Guardar</button>
      </section>
    }
    <section class="panel table-responsive">
      <table class="table align-middle">
        <thead><tr><th>Nombre</th><th>Usuario</th><th>Rol</th><th>Estado</th><th></th></tr></thead>
        <tbody>
          @for (u of trabajadores(); track u.id) {
            <tr><td>{{ u.nombreCompleto }}</td><td>{{ u.username }}</td><td>{{ rolLabel(u.rol) }}</td><td><span class="badge" [class]="u.activo ? 'bg-success' : 'bg-secondary'">{{ u.activo ? 'Activo' : 'Inactivo' }}</span></td><td class="text-end"><button class="btn btn-sm" [class]="u.activo ? 'btn-outline-danger' : 'btn-outline-success'" [disabled]="u.id === currentUserId()" (click)="toggle(u)">{{ u.activo ? 'Desactivar' : 'Activar' }}</button></td></tr>
          } @empty {
            <tr><td colspan="5" class="text-center text-muted py-4">No hay trabajadores registrados</td></tr>
          }
        </tbody>
      </table>
    </section>
  `,
})
export class TrabajadoresComponent implements OnInit {
  private readonly service = inject(UsuarioService);
  private readonly toast = inject(ToastService);
  private readonly auth = inject(AuthService);
  usuarios: UsuarioResumen[] = [];
  showForm = false;
  form: Trabajador = { username: '', password: '', nomTrabajador: '', apeTrabajador: '', dni: '', fecNacimiento: '', email: '', telefono: '' };

  ngOnInit(): void { this.load(); }
  load(): void { this.service.getUsuarios().subscribe((u) => this.usuarios = u); }
  trabajadores(): UsuarioResumen[] { return this.usuarios.filter((u) => u.rol === 'ROLE_TRABAJADOR' || u.rol === 'ROLE_ADMIN'); }
  create(): void {
    this.service.createTrabajador(this.form).subscribe({
      next: () => { this.toast.showSuccess('Trabajador creado'); this.showForm = false; this.form = { username: '', password: '', nomTrabajador: '', apeTrabajador: '', dni: '', fecNacimiento: '', email: '', telefono: '' }; this.load(); },
      error: (error: HttpErrorResponse) => this.toast.showError(error.error?.mensaje || 'No se pudo crear el trabajador'),
    });
  }
  toggle(u: UsuarioResumen): void {
    this.service.toggleEstado(u.id, !u.activo).subscribe({
      next: () => { this.toast.showSuccess('Estado actualizado'); this.load(); },
      error: (error: HttpErrorResponse) => this.toast.showError(error.error?.mensaje || 'No se pudo actualizar el estado'),
    });
  }
  currentUserId(): number {
    return Number(this.auth.getUserId());
  }
  rolLabel(rol: string): string {
    return rol === 'ROLE_ADMIN' ? 'Administrador' : 'Trabajador';
  }
}
