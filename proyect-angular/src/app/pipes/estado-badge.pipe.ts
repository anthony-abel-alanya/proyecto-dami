import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'estadoLabel', standalone: true })
export class EstadoBadgePipe implements PipeTransform {
  transform(value?: string): string {
    const labels: Record<string, string> = {
      PENDIENTE: 'Pendiente',
      EN_PROCESO: 'En proceso',
      APROBADA: 'Aprobada',
      RECHAZADA: 'Rechazada',
      DISPONIBLE: 'Disponible',
      RESERVADO: 'Reservado',
      ADOPTADO: 'Adoptado',
      INACTIVO: 'Inactivo',
      SIN_ACTA: 'Sin acta',
      GENERADA: 'Generada',
      FIRMADA: 'Firmada',
      VERIFICADA: 'Verificada',
      'SIN NOVEDADES': 'Sin novedades',
      'EN TRATAMIENTO': 'En tratamiento',
      CRITICO: 'Critico',
    };
    return value ? labels[value] ?? value : '';
  }
}
