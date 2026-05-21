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
  templateUrl: './trabajadores.html',
  styleUrls: ['./trabajadores.css'],
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
