import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayOfWeek',
  standalone: true
})
export class DayOfWeekPipe implements PipeTransform {

  transform(value: string): string {

    if (!value) return '';

    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    const days = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado'
    ];

    return days[date.getDay()];
  }

}
