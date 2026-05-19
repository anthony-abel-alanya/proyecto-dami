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
  template: `
    <a class="btn btn-outline-secondary mb-3" routerLink="/solicitudes">Volver a la lista</a>
    @if (solicitud) {
      <div class="page-head"><div><h1>Solicitud #{{ solicitud.idSolicitud }}</h1><p>{{ solicitud.fechaRegistro | date:'fullDate' }}</p></div></div>
      <div class="detail-grid">
        <section class="panel">
          <h2>Datos</h2>
          <dl>
            <dt>Adoptante</dt><dd>{{ solicitud.adoptanteNombre }}</dd>
            <dt>DNI</dt><dd>{{ solicitud.adoptanteDni }}</dd>
            <dt>Mascota</dt><dd>{{ solicitud.mascotaNombre }}</dd>
            <dt>Comentario</dt><dd>{{ solicitud.comentario || '-' }}</dd>
          </dl>
        </section>
        <section class="panel">
          <h2>Estado y acciones</h2>
          <p><span class="badge badge-large" [class]="badgeClass(solicitud.estadoSolicitud)">{{ solicitud.estadoSolicitud | estadoLabel }}</span></p>
          <ol class="timeline">
            <li class="done">Solicitud recibida</li>
            <li [class.done]="solicitud.estadoSolicitud !== 'PENDIENTE'">En proceso</li>
            <li [class.done]="actaPaso('GENERADA')">Acta generada</li>
            <li [class.done]="actaPaso('FIRMADA')">Acta firmada</li>
            <li [class.done]="solicitud.estadoSolicitud === 'APROBADA' || solicitud.estadoSolicitud === 'RECHAZADA'">Cierre</li>
          </ol>
          <div class="action-stack">
            @if (solicitud.estadoSolicitud === 'PENDIENTE') {
              <button class="btn btn-primary" (click)="cambiarEstado('EN_PROCESO')">Iniciar Proceso</button>
            }
            @if (solicitud.estadoSolicitud === 'EN_PROCESO' && solicitud.estadoActa === 'SIN_ACTA') {
              <button class="btn btn-primary" (click)="descargarActa()">Generar Acta PDF</button>
            }
            @if (solicitud.estadoActa === 'GENERADA') {
              <button class="btn btn-outline-primary" (click)="descargarActa()">Descargar Acta</button>
              <p class="text-muted">Esperando acta firmada del adoptante.</p>
            }
            @if (solicitud.estadoActa === 'FIRMADA') {
              <a class="btn btn-outline-primary" [href]="service.fileUrl(solicitud.rutaPdfFirmado)" target="_blank">Descargar Acta Firmada</a>
              <button class="btn btn-success" (click)="verificar()">Verificar y Aprobar</button>
            }
            @if (solicitud.estadoSolicitud !== 'APROBADA' && solicitud.estadoSolicitud !== 'RECHAZADA') {
              <button class="btn btn-outline-danger" (click)="rechazar()">Rechazar</button>
            }
            @if (solicitud.estadoSolicitud === 'APROBADA') { <div class="alert alert-success">Adopcion aprobada</div> }
            @if (solicitud.estadoSolicitud === 'RECHAZADA') { <div class="alert alert-danger">Solicitud rechazada</div> }
          </div>
        </section>
      </div>
    } @else if (error) {
      <section class="panel"><p class="text-danger mb-0">{{ error }}</p></section>
    } @else {
      <section class="panel"><p class="text-muted mb-0">Cargando solicitud...</p></section>
    }
  `,
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
