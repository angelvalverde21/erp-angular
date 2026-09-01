import { Pipe, PipeTransform } from '@angular/core';

interface FechaServidor {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

@Pipe({
  name: 'DateShopify'
})
export class DateShopifyPipe implements PipeTransform {

  private readonly timeZone = 'America/Lima';

  transform(value: string | Date | null | undefined): string {
    if (!value) return '';

    const fecha = this.parseFechaServidor(value);

    if (!fecha) return '';

    const ahora = new Date();
    const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    const fechaSoloDia = new Date(fecha.year, fecha.month - 1, fecha.day);
    const diffMs = hoy.getTime() - fechaSoloDia.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const fechaDate = new Date(fecha.year, fecha.month - 1, fecha.day);
    const horaMin = `${this.dosDigitos(fecha.hour)}:${this.dosDigitos(fecha.minute)}`;
    const nombreDia = fechaDate.toLocaleDateString('es-PE', { weekday: 'long' });
    const nombreMes = fechaDate.toLocaleDateString('es-PE', { month: 'short' });

    if (diffDias === 0) {
      return `Hoy a las ${horaMin}`;
    } else if (diffDias === 1) {
      return `Ayer a las ${horaMin}`;
    } else if (diffDias > 1 && diffDias <= 7) {
      return `${this.capitalizar(nombreDia)} a las ${horaMin}`;
    } else {
      return `${fecha.day} ${nombreMes} a las ${horaMin}`;
    }
  }

  private parseFechaServidor(value: string | Date): FechaServidor | null {
    if (value instanceof Date) {
      return this.parseFechaConZona(value);
    }

    if (this.tieneZonaHoraria(value)) {
      return this.parseFechaConZona(new Date(value));
    }

    const match = value.match(
      /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?)?/
    );

    if (!match) return null;

    return {
      year: Number(match[1]),
      month: Number(match[2]),
      day: Number(match[3]),
      hour: Number(match[4] ?? 0),
      minute: Number(match[5] ?? 0)
    };
  }

  private tieneZonaHoraria(value: string): boolean {
    return /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value);
  }

  private parseFechaConZona(value: Date): FechaServidor | null {
    if (Number.isNaN(value.getTime())) return null;

    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: this.timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).formatToParts(value);

    const getPart = (type: Intl.DateTimeFormatPartTypes) =>
      Number(parts.find((part) => part.type === type)?.value);

    return {
      year: getPart('year'),
      month: getPart('month'),
      day: getPart('day'),
      hour: getPart('hour'),
      minute: getPart('minute')
    };
  }

  private dosDigitos(valor: number): string {
    return valor.toString().padStart(2, '0');
  }

  private capitalizar(texto: string): string {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }
}
