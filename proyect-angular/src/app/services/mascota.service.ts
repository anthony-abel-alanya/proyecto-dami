import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Mascota, MascotaFiltros } from '../models/mascota.model';

@Injectable({ providedIn: 'root' })
export class MascotaService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/mascotas`;

  getAll(filtros: MascotaFiltros = {}): Observable<Mascota[]> {
    let params = new HttpParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<Mascota[]>(this.api, { params });
  }

  getById(id: number): Observable<Mascota> {
    return this.http.get<Mascota>(`${this.api}/${id}`);
  }

  create(formData: FormData): Observable<Mascota> {
    return this.http.post<Mascota>(this.api, formData);
  }

  update(id: number, formData: FormData): Observable<Mascota> {
    return this.http.put<Mascota>(`${this.api}/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  imageUrl(rutaImagen?: string): string {
    return rutaImagen ? `${environment.fileUrl}/uploads/${rutaImagen}` : '';
  }
}
