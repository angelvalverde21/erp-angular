import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lateStatus',
  standalone: true
})
export class LateStatusPipe implements PipeTransform {

  transform(checkIn: string): boolean {

    if (!checkIn) return false;

    const parts = checkIn.split(':').map(Number);

    const checkInDate = new Date();
    checkInDate.setHours(parts[0], parts[1], parts[2]);

    const limit = new Date();
    limit.setHours(10, 10, 0); // 10:15 con tolerancia

    return checkInDate.getTime() > limit.getTime();
  }
}