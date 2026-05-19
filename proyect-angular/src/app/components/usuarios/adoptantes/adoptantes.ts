import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Adoptante } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-adoptantes',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page-head"><div><h1>Adoptantes</h1><p>Cuentas registradas para las solicitudes de adopción.</p></div></div>
    <section class="panel filters"><input class="form-control" placeholder="Buscar por nombre o DNI" [(ngModel)]="q"></section>
    <section class="panel table-responsive">
      <table class="table align-middle">
        <thead><tr><th>Nombre</th><th>DNI</th><th>Email</th><th>Telefono</th><th>Direccion</th><th>Estado</th><th></th></tr></thead>
        <tbody>
          @for (a of filtrados(); track a.id) {
            <tr><td>{{ a.nomAdoptante }} {{ a.apeAdoptante }}</td><td>{{ a.dni }}</td><td>{{ a.email }}</td><td>{{ a.telefono }}</td><td>{{ a.direccion }}</td><td><span class="badge" [class]="a.activo ? 'bg-success' : 'bg-secondary'">{{ a.activo ? 'Activo' : 'Inactivo' }}</span></td><td class="text-end"><button class="btn btn-sm" [class]="a.activo ? 'btn-outline-danger' : 'btn-outline-success'" (click)="toggle(a)">{{ a.activo ? 'Desactivar' : 'Activar' }}</button></td></tr>
          } @empty {
            <tr><td colspan="7" class="text-center text-muted py-4">No hay adoptantes registrados</td></tr>
          }
        </tbody>
      </table>
    </section>
  `,
})
export class AdoptantesComponent implements OnInit {
  private readonly service = inject(UsuarioService);
  private readonly toast = inject(ToastService);
  adoptantes: Adoptante[] = [];
  q = '';

  ngOnInit(): void { this.load(); }
  load(): void {
    this.service.getAdoptantes().subscribe({
      next: (a) => this.adoptantes = a,
      error: () => this.toast.showError('No se pudo cargar adoptantes'),
    });
  }
  filtrados(): Adoptante[] {
    const q = this.q.toLowerCase();
    return this.adoptantes.filter((a) => `${a.nomAdoptante} ${a.apeAdoptante} ${a.dni}`.toLowerCase().includes(q));
  }
  toggle(a: Adoptante): void {
    this.service.toggleEstado(a.id, !a.activo).subscribe({
      next: () => { this.toast.showSuccess('Estado actualizado'); this.load(); },
      error: () => this.toast.showError('No se pudo actualizar el estado'),
    });
  }
}
