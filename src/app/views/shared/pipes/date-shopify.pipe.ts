import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'DateShopify'
})
export class DateShopifyPipe implements PipeTransform {

  transform(value: string | Date | null | undefined): string {
    if (!value) return '';

    let fecha: Date;

    if (value instanceof Date) {
      fecha = value;

    } else if (typeof value === 'string') {

      // 🔹 Normalizamos formato
      const limpio = value.replace('T', ' ').replace('Z', '');

      const partes = limpio.split(' ');

      if (partes.length < 2) return '';

      const [datePart, timePart] = partes;

      const [year, month, day] = datePart.split('-').map(Number);
      const [hour, minute, second] = timePart.split(':').map(Number);

      fecha = new Date(year, month - 1, day, hour, minute, second);
    } else {
      return '';
    }

    const ahora = new Date();
    const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    const fechaSoloDia = new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      fecha.getDate()
    );

    const diffMs = hoy.getTime() - fechaSoloDia.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const horaMin = formatDate(fecha, 'HH:mm', 'es-PE');
    const nombreDia = fecha.toLocaleDateString('es-PE', { weekday: 'long' });
    const nombreMes = fecha.toLocaleDateString('es-PE', { month: 'short' });

    if (diffDias === 0) {
      return `Hoy a las ${horaMin}`;
    } else if (diffDias === 1) {
      return `Ayer a las ${horaMin}`;
    } else if (diffDias > 1 && diffDias <= 7) {
      return `${this.capitalizar(nombreDia)} a las ${horaMin}`;
    } else {
      return `${fecha.getDate()} ${nombreMes} a las ${horaMin}`;
    }
  }

  private capitalizar(texto: string): string {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }
}