export interface Mascota {
  idMascota: number;
  nombre: string;
  especie: string;
  raza: string;
  edadAnios: number;
  edadMeses: number;
  descripcion?: string;
  estadoSalud: string;
  estadoAdopcion: string;
  rutaImagen?: string;
  categoriaId?: number;
  categoriaNombre?: string;
  fechaCreacion?: string;
}

export interface MascotaFiltros {
  especie?: string;
  idCategoria?: number | string;
  estadoAdopcion?: string;
  nombre?: string;
}
