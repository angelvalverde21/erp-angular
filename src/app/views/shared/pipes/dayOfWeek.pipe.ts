import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayOfWeek',
  standalone: true
})
export class DayOfWeekPipe implements PipeTransform {

  transform(value: number | string): string {

    if (value === null || value === undefined || value === '') {
      return '';
    }

    const days = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado'
    ];

    // 🔹 Si es número (1–7)
    if (!isNaN(Number(value))) {

      const dayNumber = Number(value);

      if (dayNumber >= 1 && dayNumber <= 7) {
        // 1 = Lunes, 7 = Domingo
        const map = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
        return map[dayNumber - 1];
      }

      return '';
    }

    // 🔹 Si es fecha tipo YYYY-MM-DD
    if (typeof value === 'string' && value.includes('-')) {

      const parts = value.split(' ')[0]; // por si viene con hora
      const [year, month, day] = parts.split('-').map(Number);

      const date = new Date(year, month - 1, day);

      return days[date.getDay()];
    }

    return '';
  }

}