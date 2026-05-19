import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Categoria } from '../../models/categoria.model';
import { CategoriaService } from '../../services/categoria.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page-head"><div><h1>Categor&iacute;as de adopci&oacute;n</h1><p>Clasificaciones internas para orientar la gesti&oacute;n de cada mascota.</p></div></div>
    <section class="panel inline-form">
      <input class="form-control" placeholder="Nombre" [(ngModel)]="form.nombre">
      <input class="form-control" placeholder="Descripci&oacute;n" [(ngModel)]="form.descripcion">
      <button class="btn btn-primary" [disabled]="!form.nombre?.trim()" (click)="save()">{{ editingId ? 'Actualizar' : 'Crear' }}</button>
      @if (editingId) { <button class="btn btn-outline-secondary" (click)="cancel()">Cancelar</button> }
    </section>
    <section class="panel table-responsive">
      <table class="table align-middle">
        <thead><tr><th>ID</th><th>Nombre</th><th>Descripci&oacute;n</th><th>Mascotas vinculadas</th><th></th></tr></thead>
        <tbody>
          @for (c of categorias; track c.id) {
            <tr><td>{{ c.id }}</td><td>{{ c.nombre }}</td><td>{{ c.descripcion || '-' }}</td><td>{{ c.cantidadMascotas ?? 0 }}</td><td class="text-end"><button class="btn btn-sm btn-outline-primary me-2" (click)="edit(c)">Editar</button><button class="btn btn-sm btn-outline-danger" [disabled]="(c.cantidadMascotas ?? 0) > 0" (click)="remove(c)">Eliminar</button></td></tr>
          } @empty {
            <tr><td colspan="5" class="text-center text-muted py-4">No hay categor&iacute;as registradas</td></tr>
          }
        </tbody>
      </table>
    </section>
  `,
})
export class CategoriasComponent implements OnInit {
  private readonly service = inject(CategoriaService);
  private readonly toast = inject(ToastService);
  categorias: Categoria[] = [];
  form: Partial<Categoria> = { nombre: '', descripcion: '' };
  editingId?: number;

  ngOnInit(): void { this.load(); }
  load(): void { this.service.getAll().subscribe((c) => this.categorias = c); }
  edit(c: Categoria): void { this.editingId = c.id; this.form = { nombre: c.nombre, descripcion: c.descripcion }; }
  cancel(): void { this.editingId = undefined; this.form = { nombre: '', descripcion: '' }; }
  save(): void {
    const request = this.editingId ? this.service.update(this.editingId, this.form) : this.service.create(this.form);
    request.subscribe({
      next: () => { this.toast.showSuccess('Categor&iacute;a guardada'); this.cancel(); this.load(); },
      error: (error: HttpErrorResponse) => this.toast.showError(error.error?.mensaje || 'No se pudo guardar la categoria'),
    });
  }
  remove(c: Categoria): void {
    if (!c.id || !confirm(`Eliminar ${c.nombre}?`)) return;
    this.service.delete(c.id).subscribe({
      next: () => { this.toast.showSuccess('Categor&iacute;a eliminada'); this.load(); },
      error: (error: HttpErrorResponse) => this.toast.showError(error.error?.mensaje || 'No se pudo eliminar la categoria'),
    });
  }
}
