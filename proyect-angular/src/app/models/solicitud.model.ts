export interface Solicitud {
  idSolicitud: number;
  fechaRegistro?: string;
  idAdoptante: number;
  adoptanteNombre?: string;
  nombreAdoptante?: string;
  adoptanteDni?: string;
  dniAdoptante?: string;
  idMascota: number;
  mascotaNombre?: string;
  nombreMascota?: string;
  comentario?: string;
  estadoSolicitud: string;
  estadoActa: string;
  rutaPdfActa?: string;
  rutaPdfFirmado?: string;
  fechaActa?: string;
  fechaCreacion?: string;
}
