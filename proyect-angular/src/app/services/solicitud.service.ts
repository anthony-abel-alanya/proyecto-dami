import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Solicitud } from '../models/solicitud.model';

@Injectable({ providedIn: 'root' })
export class SolicitudService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/solicitudes`;

  getAll(filtros: { estadoSolicitud?: string; estadoActa?: string } = {}): Observable<Solicitud[]> {
    let params = new HttpParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value) params = params.set(key, value);
    });
    return this.http.get<Solicitud[]>(this.api, { params });
  }

  getById(id: number): Observable<Solicitud> {
    return this.http.get<Solicitud>(`${this.api}/${id}`);
  }

  cambiarEstado(id: number, estado: string): Observable<Solicitud> {
    return this.http.put<Solicitud>(`${this.api}/${id}/estado`, { estado });
  }

  descargarActa(id: number): Observable<Blob> {
    return this.http.get(`${this.api}/${id}/acta`, { responseType: 'blob' });
  }

  subirActaFirmada(id: number, archivo: File): Observable<Solicitud> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return this.http.post<Solicitud>(`${this.api}/${id}/acta-firmada`, formData);
  }

  verificarActa(id: number): Observable<Solicitud> {
    return this.http.put<Solicitud>(`${this.api}/${id}/verificar-acta`, {});
  }

  fileUrl(path?: string): string {
    return path ? `${environment.fileUrl}/uploads/${path}` : '';
  }
}
