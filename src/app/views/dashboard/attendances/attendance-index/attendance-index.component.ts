import { Component, Input } from '@angular/core';
import { AttendanceIndexRowComponent } from '../attendance-index-row/attendance-index-row.component';


@Component({
  selector: 'app-attendance-index',
  imports: [
    AttendanceIndexRowComponent
  ],
  templateUrl: './attendance-index.component.html',
  styleUrl: './attendance-index.component.scss'
})
export class AttendanceIndexComponent {


  private _attendances: any[] = [];

  @Input()

  set attendances(value: any[]) {
    this._attendances = [...(value || [])].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  get attendances(): any[] {
    return this._attendances;
  }

  calculateWorkedSeconds(checkIn: string | null, checkOut: string | null): number {
    if (!checkIn || !checkOut) return 0;

    const inParts = checkIn.split(':');
    const outParts = checkOut.split(':');

    if (inParts.length < 2 || outParts.length < 2) return 0;

    const inH = Number(inParts[0]);
    const inM = Number(inParts[1]);
    const inS = Number(inParts[2] || 0);

    const outH = Number(outParts[0]);
    const outM = Number(outParts[1]);
    const outS = Number(outParts[2] || 0);

    // 🚨 validación anti-NaN
    if ([inH, inM, inS, outH, outM, outS].some(isNaN)) return 0;

    const inSec = inH * 3600 + inM * 60 + inS;
    const outSec = outH * 3600 + outM * 60 + outS;

    let diff = outSec - inSec;

    // soporte turno nocturno
    if (diff < 0) diff += 24 * 3600;

    return diff;
  }

  getTotalSeconds(attendances: any[]): number {
    return attendances.reduce((total, att) => {
      return total + this.calculateWorkedSeconds(att.check_in, att.check_out);
    }, 0);
  }

  formatSeconds(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);

    return `${h}h ${m}m`;
  }

}
