export interface DashboardResumen {
  mascotasDisponibles: number;
  solicitudesPendientes: number;
  adoptantesRegistrados: number;
  mascotasAdoptadasEsteMes: number;
}

export interface SolicitudesPorMes {
  mes: string;
  anio: number;
  cantidad: number;
}

export interface MascotasPorCategoria {
  categoria: string;
  cantidad: number;
}
