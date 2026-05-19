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
  template: `
    <div class="dashboard-head">
      <div>
        <p class="eyebrow">Panel operativo</p>
        <h1>Hola, {{ auth.getUsername() }}</h1>
        <span>{{ today | date:'fullDate' }}</span>
      </div>
      <a class="btn btn-primary" routerLink="/mascotas/nuevo">Registrar mascota</a>
    </div>

    <section class="metric-grid">
      <article class="metric-card available">
        <span class="metric-icon">M</span>
        <div>
          <small>Mascotas disponibles</small>
          <strong>{{ resumen?.mascotasDisponibles ?? 0 }}</strong>
          <p>Listas para recibir solicitudes.</p>
        </div>
      </article>
      <article class="metric-card pending">
        <span class="metric-icon">S</span>
        <div>
          <small>Solicitudes pendientes</small>
          <strong>{{ resumen?.solicitudesPendientes ?? 0 }}</strong>
          <p>{{ pendientesTexto() }}</p>
        </div>
      </article>
      <article class="metric-card adopters">
        <span class="metric-icon">A</span>
        <div>
          <small>Adoptantes registrados</small>
          <strong>{{ resumen?.adoptantesRegistrados ?? 0 }}</strong>
          <p>Personas en la base del refugio.</p>
        </div>
      </article>
      <article class="metric-card closed">
        <span class="metric-icon">OK</span>
        <div>
          <small>Adoptadas este mes</small>
          <strong>{{ resumen?.mascotasAdoptadasEsteMes ?? 0 }}</strong>
          <p>Casos cerrados correctamente.</p>
        </div>
      </article>
    </section>

    <section class="dashboard-grid">
      <article class="panel chart-panel wide">
        <div class="section-head">
          <div>
            <h2>Solicitudes por mes</h2>
            <p>Movimiento de los ultimos seis meses.</p>
          </div>
          <strong>{{ totalSolicitudesMeses() }}</strong>
        </div>
        <div class="month-chart">
          @for (item of meses; track item.mes + item.anio) {
            <div class="month-column">
              <div class="column-track"><i [style.height.%]="barWidth(item.cantidad)"></i></div>
              <b>{{ item.cantidad }}</b>
              <span>{{ item.mes.slice(0,3) }}</span>
            </div>
          } @empty {
            <p class="text-muted mb-0">No hay datos mensuales todavia.</p>
          }
        </div>
      </article>

      <article class="panel ops-panel">
        <div class="section-head">
          <div>
            <h2>Estado operativo</h2>
            <p>Lectura rapida del dia.</p>
          </div>
        </div>
        <div class="ops-list">
          <div>
            <span>Pendientes de revisión</span>
            <strong>{{ resumen?.solicitudesPendientes ?? 0 }}</strong>
          </div>
          <div>
            <span>Ultimas solicitudes</span>
            <strong>{{ ultimas.length }}</strong>
          </div>
          <div>
            <span>Tipos de mascota</span>
            <strong>{{ categorias.length }}</strong>
          </div>
        </div>
        <a class="btn btn-outline-primary w-100 mt-3" routerLink="/solicitudes">Revisar solicitudes</a>
      </article>

      <article class="panel">
        <div class="section-head">
          <div>
            <h2>Mascotas por tipo</h2>
            <p>Distribucion del catalogo.</p>
          </div>
        </div>
        <div class="type-list">
          @for (item of categorias; track item.categoria) {
            <div class="type-row">
              <span>{{ item.categoria }}</span>
              <div><i [style.width.%]="tipoWidth(item.cantidad)"></i></div>
              <strong>{{ item.cantidad }}</strong>
            </div>
          } @empty {
            <p class="text-muted mb-0">Sin mascotas registradas todavia.</p>
          }
        </div>
      </article>

      <article class="panel recent-panel">
        <div class="section-head">
          <div>
            <h2>Ultimas solicitudes</h2>
            <p>Seguimiento directo de casos.</p>
          </div>
          <a class="btn btn-outline-primary btn-sm" routerLink="/solicitudes">Revisar</a>
        </div>
        <div class="recent-list">
          @for (s of ultimas; track s.idSolicitud) {
            <a class="request-item" [routerLink]="['/solicitudes', s.idSolicitud]">
              <div>
                <strong>#{{ s.idSolicitud }} · {{ s.mascotaNombre || 'Mascota' }}</strong>
                <span>{{ s.adoptanteNombre || 'Adoptante' }} · {{ s.fechaRegistro | date:'shortDate' }}</span>
              </div>
              <span class="badge" [class]="badgeClass(s.estadoSolicitud)">{{ s.estadoSolicitud | estadoLabel }}</span>
            </a>
          } @empty {
            <p class="text-muted mb-0">No hay solicitudes recientes.</p>
          }
        </div>
      </article>
    </section>
  `,
  styles: [`
    .dashboard-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
    }
    .dashboard-head h1 { margin: 0; }
    .dashboard-head span, .eyebrow, .section-head p, .metric-card p, .request-item span { color: #68768a; }
    .eyebrow {
      margin: 0 0 4px;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    .metric-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
      margin-bottom: 18px;
    }
    .metric-card {
      min-height: 142px;
      display: flex;
      gap: 14px;
      background: #fff;
      border: 1px solid #e1e7ef;
      border-radius: 8px;
      padding: 18px;
      box-shadow: 0 10px 22px rgba(25, 42, 70, .06);
    }
    .metric-icon {
      width: 42px;
      height: 42px;
      flex: 0 0 42px;
      display: grid;
      place-items: center;
      border-radius: 8px;
      font-weight: 800;
      background: #eef4fb;
      color: #1a56a0;
    }
    .metric-card small { color: #536477; font-weight: 800; }
    .metric-card strong { display: block; font-size: 34px; line-height: 1; margin: 8px 0; color: #15253a; }
    .metric-card p { margin: 0; font-size: 13px; }
    .available { border-top: 4px solid #2563eb; }
    .pending { border-top: 4px solid #f59e0b; }
    .adopters { border-top: 4px solid #0f766e; }
    .closed { border-top: 4px solid #16a34a; }
    .dashboard-grid {
      display: grid;
      grid-template-columns: 1.35fr .65fr;
      gap: 18px;
    }
    .wide { min-height: 330px; }
    .section-head {
      display: flex;
      justify-content: space-between;
      align-items: start;
      gap: 12px;
      margin-bottom: 18px;
    }
    .section-head h2 { margin: 0 0 4px; }
    .section-head p { margin: 0; }
    .section-head > strong { font-size: 28px; color: #1a56a0; }
    .month-chart {
      min-height: 230px;
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      align-items: end;
      gap: 14px;
      border-bottom: 1px solid #e1e7ef;
      padding-top: 8px;
    }
    .month-column {
      height: 220px;
      display: grid;
      grid-template-rows: 1fr 22px 22px;
      align-items: end;
      text-align: center;
      gap: 6px;
    }
    .column-track {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: end;
      justify-content: center;
      background: #f3f7fb;
      border-radius: 8px 8px 0 0;
      overflow: hidden;
    }
    .column-track i {
      width: 100%;
      min-height: 8px;
      display: block;
      background: linear-gradient(180deg, #3b82f6, #1a56a0);
      border-radius: 8px 8px 0 0;
    }
    .month-column span { color: #68768a; text-transform: capitalize; }
    .ops-list, .type-list, .recent-list { display: grid; gap: 12px; }
    .ops-list div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: #f7fafc;
      border: 1px solid #edf1f6;
      border-radius: 8px;
    }
    .ops-list span { color: #536477; }
    .ops-list strong { color: #15253a; font-size: 20px; }
    .type-row {
      display: grid;
      grid-template-columns: 90px 1fr 34px;
      align-items: center;
      gap: 12px;
    }
    .type-row div {
      height: 10px;
      background: #e8eff7;
      border-radius: 999px;
      overflow: hidden;
    }
    .type-row i {
      display: block;
      height: 100%;
      background: #0f766e;
    }
    .request-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 12px;
      color: inherit;
      text-decoration: none;
      border: 1px solid #edf1f6;
      border-radius: 8px;
    }
    .request-item:hover { background: #f7fafc; }
    .request-item strong, .request-item span { display: block; }
    @media (max-width: 1100px) {
      .metric-grid, .dashboard-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .wide, .recent-panel { grid-column: span 2; }
    }
    @media (max-width: 720px) {
      .dashboard-head, .section-head, .request-item { align-items: stretch; flex-direction: column; }
      .metric-grid, .dashboard-grid { grid-template-columns: 1fr; }
      .wide, .recent-panel { grid-column: auto; }
      .month-chart { gap: 8px; }
      .type-row { grid-template-columns: 72px 1fr 28px; }
    }
  `],
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
