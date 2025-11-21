import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'dateShopify'
})
export class DateShopifyPipe implements PipeTransform {

  transform(value: string | Date): string {
    if (!value) return '';

    const fechaUtc = new Date(value);

    // 🔹 Convertir UTC → hora local (Perú UTC-5)
    const fechaLocal = new Date(fechaUtc.getTime());

    const ahora = new Date();
    const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    const fechaSoloDia = new Date(fechaLocal.getFullYear(), fechaLocal.getMonth(), fechaLocal.getDate());

    const diffMs = hoy.getTime() - fechaSoloDia.getTime();
    const diffDias = diffMs / (1000 * 60 * 60 * 24);

    const horaMin = formatDate(fechaLocal, 'HH:mm', 'es-PE');
    const nombreDia = fechaLocal.toLocaleDateString('es-PE', { weekday: 'long' });
    const nombreMes = fechaLocal.toLocaleDateString('es-PE', { month: 'short' });

    if (diffDias === 0) {
      return `Hoy a las ${horaMin}`;
    } else if (diffDias === 1) {
      return `Ayer a las ${horaMin}`;
    } else if (diffDias > 1 && diffDias <= 7) {
      return `${this.capitalizar(nombreDia)} a las ${horaMin}`;
    } else {
      return `${fechaLocal.getDate()} ${nombreMes} a las ${horaMin}`;
    }
  }

  private capitalizar(texto: string): string {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }
  
}