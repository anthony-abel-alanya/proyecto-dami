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
  templateUrl: './lista-mascotas.html',
  styleUrls: ['./lista-mascotas.css'],
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
