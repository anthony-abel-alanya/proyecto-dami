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
  templateUrl: './categorias.html',
  styleUrls: ['./categorias.css'],
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
