import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Categoria } from '../../../models/categoria.model';
import { Mascota } from '../../../models/mascota.model';
import { CategoriaService } from '../../../services/categoria.service';
import { MascotaService } from '../../../services/mascota.service';
import { ToastService } from '../../../services/toast.service';
import { EstadoBadgePipe } from '../../../pipes/estado-badge.pipe';

@Component({
  selector: 'app-lista-mascotas-admin',
  standalone: true,
  imports: [FormsModule, RouterLink, EstadoBadgePipe],
  template: `
    <div class="page-head">
      <div><h1>Gesti&oacute;n de Mascotas</h1><p>Control de altas, edici&oacute;n y disponibilidad.</p></div>
      <a class="btn btn-primary" routerLink="/mascotas/nuevo">Nueva Mascota</a>
    </div>
    <section class="panel filters">
      <input class="form-control" placeholder="Buscar por nombre" [(ngModel)]="filtros.nombre">
      <select class="form-select" [(ngModel)]="filtros.especie"><option value="">Tipo de mascota</option><option>Perro</option><option>Gato</option><option>Conejo</option><option>Ave</option><option>Otro</option></select>
      <select class="form-select" [(ngModel)]="filtros.idCategoria"><option value="">Categor&iacute;a de adopci&oacute;n</option>@for (c of categorias; track c.id) {<option [value]="c.id">{{ c.nombre }}</option>}</select>
      <select class="form-select" [(ngModel)]="filtros.estadoAdopcion"><option value="">Estado de adopci&oacute;n</option><option>DISPONIBLE</option><option>RESERVADO</option><option>ADOPTADO</option><option>INACTIVO</option></select>
      <button class="btn btn-primary" (click)="load()">Buscar</button>
      <button class="btn btn-outline-secondary" (click)="limpiar()">Limpiar</button>
    </section>
    <section class="panel table-responsive">
      <table class="table align-middle">
        <thead><tr><th>Imagen</th><th>Nombre</th><th>Tipo</th><th>Raza</th><th>Categor&iacute;a</th><th>Edad</th><th>Salud</th><th>Adopci&oacute;n</th><th></th></tr></thead>
        <tbody>
          @for (m of mascotas; track m.idMascota) {
            <tr>
              <td><img class="thumb" [src]="imageUrl(m)" alt=""></td>
              <td><strong>{{ m.nombre }}</strong></td>
              <td>{{ m.especie }}</td>
              <td>{{ m.raza }}</td>
              <td>{{ m.categoriaNombre || '-' }}</td>
              <td>{{ edadTexto(m) }}</td>
              <td><span class="badge bg-info">{{ m.estadoSalud | estadoLabel }}</span></td>
              <td><span class="badge" [class]="badgeClass(m.estadoAdopcion)">{{ m.estadoAdopcion | estadoLabel }}</span></td>
              <td class="text-end">
                <a class="btn btn-sm btn-outline-primary me-2" [routerLink]="['/mascotas/editar', m.idMascota]">Editar</a>
                <button class="btn btn-sm btn-outline-danger" (click)="eliminar(m)">Eliminar</button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="9" class="text-center text-muted py-4">No hay mascotas encontradas</td></tr>
          }
        </tbody>
      </table>
    </section>
  `,
})
export class ListaMascotasAdminComponent implements OnInit {
  private readonly mascotasService = inject(MascotaService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly toast = inject(ToastService);
  mascotas: Mascota[] = [];
  categorias: Categoria[] = [];
  filtros = { nombre: '', especie: '', idCategoria: '', estadoAdopcion: '' };

  ngOnInit(): void {
    this.categoriaService.getAll().subscribe({
      next: (categorias) => this.categorias = categorias,
      error: () => this.toast.showError('No se pudieron cargar las categorias de adopcion'),
    });
    this.load();
  }

  load(): void {
    this.mascotasService.getAll(this.filtros).subscribe({
      next: (m) => this.mascotas = m,
      error: () => this.toast.showError('No se pudo cargar la lista de mascotas'),
    });
  }

  limpiar(): void {
    this.filtros = { nombre: '', especie: '', idCategoria: '', estadoAdopcion: '' };
    this.load();
  }

  eliminar(mascota: Mascota): void {
    if (!confirm(`Seguro que deseas eliminar a ${mascota.nombre}?`)) return;
    this.mascotasService.delete(mascota.idMascota).subscribe(() => {
      this.toast.showSuccess('Mascota dada de baja');
      this.load();
    });
  }

  edadTexto(m: Mascota): string {
    const anios = m.edadAnios ?? 0;
    const meses = m.edadMeses ?? 0;
    const partes = [];
    if (anios > 0) partes.push(`${anios} ${anios === 1 ? 'a\u00f1o' : 'a\u00f1os'}`);
    if (meses > 0 || partes.length === 0) partes.push(`${meses} ${meses === 1 ? 'mes' : 'meses'}`);
    return partes.join(' ');
  }

  imageUrl(m: Mascota): string {
    return this.mascotasService.imageUrl(m.rutaImagen) || 'assets/img/fondologin.jpg';
  }

  badgeClass(estado: string): string {
    return `badge-${estado.toLowerCase()}`;
  }
}
