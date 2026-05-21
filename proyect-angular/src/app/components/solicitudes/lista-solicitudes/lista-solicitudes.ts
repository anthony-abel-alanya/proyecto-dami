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
  templateUrl: './lista-solicitudes.html',
  styleUrls: ['./lista-solicitudes.css'],
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
