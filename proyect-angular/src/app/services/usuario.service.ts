import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Adoptante, Perfil, Trabajador, UsuarioResumen } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/usuarios`;

  getUsuarios(): Observable<UsuarioResumen[]> {
    return this.http.get<UsuarioResumen[]>(this.api);
  }

  getAdoptantes(): Observable<Adoptante[]> {
    return this.http.get<Adoptante[]>(`${this.api}/adoptantes`);
  }

  createTrabajador(data: Trabajador): Observable<Trabajador> {
    return this.http.post<Trabajador>(`${this.api}/trabajador`, data);
  }

  toggleEstado(id: number, activo: boolean): Observable<UsuarioResumen> {
    return this.http.put<UsuarioResumen>(`${this.api}/${id}/estado`, { activo });
  }

  getPerfil(): Observable<Perfil> {
    return this.http.get<Perfil>(`${this.api}/perfil`);
  }

  updatePerfil(data: Partial<Perfil>): Observable<Perfil> {
    return this.http.put<Perfil>(`${this.api}/perfil`, data);
  }
}
