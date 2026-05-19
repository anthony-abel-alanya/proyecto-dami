import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Solicitud } from '../../../models/solicitud.model';
import { SolicitudService } from '../../../services/solicitud.service';
import { EstadoBadgePipe } from '../../../pipes/estado-badge.pipe';

@Component({
  selector: 'app-lista-solicitudes-admin',
  standalone: true,
  imports: [FormsModule, DatePipe, RouterLink, EstadoBadgePipe],
  template: `
    <div class="page-head"><div><h1>Gestión de Solicitudes</h1><p>Seguimiento del flujo de adopción.</p></div></div>
    <section class="panel filters">
      <select class="form-select" [(ngModel)]="estadoSolicitud"><option value="">Estado solicitud</option><option>PENDIENTE</option><option>EN_PROCESO</option><option>APROBADA</option><option>RECHAZADA</option></select>
      <select class="form-select" [(ngModel)]="estadoActa"><option value="">Estado acta</option><option>SIN_ACTA</option><option>GENERADA</option><option>FIRMADA</option><option>VERIFICADA</option></select>
      <button class="btn btn-primary" (click)="load()">Filtrar</button>
      <button class="btn btn-outline-secondary" (click)="estadoSolicitud=''; estadoActa=''; load()">Limpiar</button>
    </section>
    <section class="panel table-responsive">
      <table class="table align-middle">
        <thead><tr><th>#</th><th>Adoptante</th><th>Mascota</th><th>Fecha</th><th>Solicitud</th><th>Acta</th><th></th></tr></thead>
        <tbody>
          @for (s of filtradas(); track s.idSolicitud) {
            <tr [routerLink]="['/solicitudes', s.idSolicitud]" class="click-row">
              <td>#{{ s.idSolicitud }}</td>
              <td>{{ s.adoptanteNombre }}<br><small>{{ s.adoptanteDni }}</small></td>
              <td>{{ s.mascotaNombre }}</td>
              <td>{{ s.fechaRegistro | date:'shortDate' }}</td>
              <td><span class="badge" [class]="badgeClass(s.estadoSolicitud)">{{ s.estadoSolicitud | estadoLabel }}</span></td>
              <td><span class="badge bg-secondary">{{ s.estadoActa | estadoLabel }}</span></td>
              <td><a class="btn btn-sm btn-outline-primary" [routerLink]="['/solicitudes', s.idSolicitud]" (click)="$event.stopPropagation()">Ver Detalle</a></td>
            </tr>
          } @empty {
            <tr><td colspan="7" class="text-center text-muted py-4">No hay solicitudes con los filtros seleccionados</td></tr>
          }
        </tbody>
      </table>
    </section>
  `,
})
export class ListaSolicitudesAdminComponent implements OnInit {
  private readonly service = inject(SolicitudService);
  solicitudes: Solicitud[] = [];
  estadoSolicitud = '';
  estadoActa = '';

  ngOnInit(): void { this.load(); }

  load(): void {
    this.service.getAll().subscribe((s) => this.solicitudes = s);
  }

  filtradas(): Solicitud[] {
    return this.solicitudes.filter((s) =>
      (!this.estadoSolicitud || s.estadoSolicitud === this.estadoSolicitud) &&
      (!this.estadoActa || s.estadoActa === this.estadoActa));
  }

  badgeClass(estado: string): string { return `badge-${estado.toLowerCase().replace('_', '-')}`; }
}
