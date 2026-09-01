import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateToString'
})
export class DateToStringPipe implements PipeTransform {

  transform(value: string | Date): string {
    if (!value) return '';

    const fecha = this.parseFecha(value);

    if (isNaN(fecha.getTime())) {
      console.error('Fecha inválida:', value);
      return '';
    }

    const texto = new Intl.DateTimeFormat('es-PE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(fecha);

    // Capitalizar primera letra + coma antes del año
    return texto
      .charAt(0).toUpperCase() + texto.slice(1)
      .replace(/(\d{4})$/, ', $1');
  }

  private parseFecha(value: string | Date): Date {
    if (value instanceof Date) return value;

    // 🔥 Soporta formato "YYYY-MM-DD HH:mm:ss"
    if (typeof value === 'string' && value.includes(' ')) {
      return new Date(value.replace(' ', 'T'));
    }

    return new Date(value);
  }
}