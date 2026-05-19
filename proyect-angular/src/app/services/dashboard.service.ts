import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DashboardResumen, MascotasPorCategoria, SolicitudesPorMes } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/dashboard`;

  getResumen(): Observable<DashboardResumen> {
    return this.http.get<DashboardResumen>(`${this.api}/resumen`);
  }

  getSolicitudesPorMes(): Observable<SolicitudesPorMes[]> {
    return this.http.get<SolicitudesPorMes[]>(`${this.api}/solicitudes-por-mes`);
  }

  getMascotasPorCategoria(): Observable<MascotasPorCategoria[]> {
    return this.http.get<MascotasPorCategoria[]>(`${this.api}/mascotas-por-categoria`);
  }
}
