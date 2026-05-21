import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Solicitud } from '../../../models/solicitud.model';
import { SolicitudService } from '../../../services/solicitud.service';
import { ToastService } from '../../../services/toast.service';
import { EstadoBadgePipe } from '../../../pipes/estado-badge.pipe';

@Component({
  selector: 'app-detalle-solicitud',
  standalone: true,
  imports: [DatePipe, RouterLink, EstadoBadgePipe],
  templateUrl: './detalle-solicitud.html',
  styleUrls: ['./detalle-solicitud.css'],
})
export class DetalleSolicitudComponent implements OnInit {
  readonly service = inject(SolicitudService);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);
  solicitud?: Solicitud;
  error = '';

  ngOnInit(): void { this.load(); }

  load(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.error = '';
    this.service.getById(id).subscribe({
      next: (s) => this.solicitud = s,
      error: () => {
        this.solicitud = undefined;
        this.error = 'No se pudo cargar el detalle de la solicitud';
      },
    });
  }

  cambiarEstado(estado: string): void {
    if (!this.solicitud) return;
    this.service.cambiarEstado(this.solicitud.idSolicitud, estado).subscribe(() => {
      this.toast.showSuccess('Estado actualizado');
      this.load();
    });
  }

  rechazar(): void {
    if (confirm('Seguro que deseas rechazar esta solicitud?')) this.cambiarEstado('RECHAZADA');
  }

  descargarActa(): void {
    if (!this.solicitud) return;
    this.service.descargarActa(this.solicitud.idSolicitud).subscribe((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `acta_solicitud_${this.solicitud?.idSolicitud}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      this.toast.showSuccess('Acta generada');
      this.load();
    });
  }

  verificar(): void {
    if (!this.solicitud || !confirm('Verificar acta y aprobar adopción?')) return;
    this.service.verificarActa(this.solicitud.idSolicitud).subscribe(() => {
      this.toast.showSuccess('Acta verificada');
      this.load();
    });
  }

  actaPaso(paso: string): boolean {
    const orden = ['SIN_ACTA', 'GENERADA', 'FIRMADA', 'VERIFICADA'];
    return orden.indexOf(this.solicitud?.estadoActa ?? 'SIN_ACTA') >= orden.indexOf(paso);
  }

  badgeClass(estado: string): string { return `badge-${estado.toLowerCase().replace('_', '-')}`; }
}
