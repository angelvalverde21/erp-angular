import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'attendanceStatus',
  standalone: true
})
export class AttendanceStatusPipe implements PipeTransform {

  transform(checkIn: string, checkOut: string): boolean {

    if (!checkIn || !checkOut) return false;

    const inParts = checkIn.split(':').map(Number);
    const outParts = checkOut.split(':').map(Number);

    const inDate = new Date();
    inDate.setHours(inParts[0], inParts[1], inParts[2]);

    const outDate = new Date();
    outDate.setHours(outParts[0], outParts[1], outParts[2]);

    const diffHours = (outDate.getTime() - inDate.getTime()) / 3600000;

    return diffHours >= 9;
  }
}