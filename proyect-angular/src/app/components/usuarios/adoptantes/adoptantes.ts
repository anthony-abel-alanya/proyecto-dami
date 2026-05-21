import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Adoptante } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-adoptantes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './adoptantes.html',
  styleUrls: ['./adoptantes.css'],
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
