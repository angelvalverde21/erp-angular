import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutesToHours',
  standalone: true
})
export class MinutesToHoursPipe implements PipeTransform {

  transform(minutes: number | null | undefined): string {

    if (minutes == null || isNaN(minutes)) {
      return '00h 00m';
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours.toString().padStart(2, '0')}h ${remainingMinutes
      .toString()
      .padStart(2, '0')}m`;
  }

}