export interface UsuarioResumen {
  id: number;
  username: string;
  rol: string;
  activo: boolean;
  fechaCreacion?: string;
  nombreCompleto: string;
}

export interface Adoptante {
  id: number;
  username: string;
  nomAdoptante: string;
  apeAdoptante: string;
  fecNacimiento?: string;
  dni: string;
  email: string;
  telefono: string;
  direccion: string;
  activo: boolean;
}

export interface Trabajador {
  id?: number;
  username: string;
  password?: string;
  nomTrabajador: string;
  apeTrabajador: string;
  dni: string;
  fecNacimiento: string;
  email: string;
  telefono: string;
  activo?: boolean;
}

export interface Perfil {
  id: number;
  username: string;
  rol: string;
  nombres?: string;
  apellidos?: string;
  dni?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
}
