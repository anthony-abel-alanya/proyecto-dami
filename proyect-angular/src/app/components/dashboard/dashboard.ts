import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../services/dashboard.service';
import { SolicitudService } from '../../services/solicitud.service';
import { DashboardResumen, MascotasPorCategoria, SolicitudesPorMes } from '../../models/dashboard.model';
import { Solicitud } from '../../models/solicitud.model';
import { EstadoBadgePipe } from '../../pipes/estado-badge.pipe';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink, EstadoBadgePipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly dashboard = inject(DashboardService);
  private readonly solicitudes = inject(SolicitudService);
  private readonly toast = inject(ToastService);

  today = new Date();
  resumen?: DashboardResumen;
  meses: SolicitudesPorMes[] = [];
  categorias: MascotasPorCategoria[] = [];
  ultimas: Solicitud[] = [];

  ngOnInit(): void {
    forkJoin({
      resumen: this.dashboard.getResumen().pipe(catchError(() => {
        this.toast.showError('No se pudo cargar el resumen del dashboard');
        return of({ mascotasDisponibles: 0, solicitudesPendientes: 0, adoptantesRegistrados: 0, mascotasAdoptadasEsteMes: 0 });
      })),
      meses: this.dashboard.getSolicitudesPorMes().pipe(catchError(() => of([]))),
      categorias: this.dashboard.getMascotasPorCategoria().pipe(catchError(() => of([]))),
      solicitudes: this.solicitudes.getAll().pipe(catchError(() => of([]))),
    }).subscribe({
      next: (data) => {
        this.resumen = data.resumen;
        this.meses = data.meses;
        this.categorias = data.categorias;
        this.ultimas = data.solicitudes.slice(0, 5);
      },
    });
  }

  barWidth(value: number): number {
    const max = Math.max(1, ...this.meses.map((m) => m.cantidad));
    return Math.max(6, (value / max) * 100);
  }

  tipoWidth(value: number): number {
    const max = Math.max(1, ...this.categorias.map((c) => c.cantidad));
    return Math.max(8, (value / max) * 100);
  }

  totalSolicitudesMeses(): number {
    return this.meses.reduce((total, item) => total + item.cantidad, 0);
  }

  pendientesTexto(): string {
    const pendientes = this.resumen?.solicitudesPendientes ?? 0;
    return pendientes === 1 ? '1 caso espera revision.' : `${pendientes} casos esperan revision.`;
  }

  badgeClass(estado: string): string {
    return `badge-${estado.toLowerCase().replace('_', '-')}`;
  }
}
