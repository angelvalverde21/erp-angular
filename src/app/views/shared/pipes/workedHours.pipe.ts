import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'workedHours',
  standalone: true
})
export class WorkedHoursPipe implements PipeTransform {

  transform(checkIn: string, checkOut: string): string {

    if (!checkIn || !checkOut) return '-';

    const inParts = checkIn.split(':').map(Number);
    const outParts = checkOut.split(':').map(Number);

    const inDate = new Date();
    inDate.setHours(inParts[0], inParts[1], inParts[2]);

    const outDate = new Date();
    outDate.setHours(outParts[0], outParts[1], outParts[2]);

    let diff = (outDate.getTime() - inDate.getTime()) / 1000;

    if (diff < 0) return '0h 0m';

    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    return `${hours}h ${minutes}m`;
  }
}