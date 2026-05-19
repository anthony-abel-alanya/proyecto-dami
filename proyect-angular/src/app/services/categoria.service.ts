import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Categoria } from '../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/categorias`;

  getAll(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.api);
  }

  create(data: Partial<Categoria>): Observable<Categoria> {
    return this.http.post<Categoria>(this.api, data);
  }

  update(id: number, data: Partial<Categoria>): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.api}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
