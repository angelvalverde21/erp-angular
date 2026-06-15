import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AttendanceIndexRowComponent } from '../attendance-index-row/attendance-index-row.component';
import { MinutesToHoursPipe } from '@shared/pipes/minutesToHours.pipe'
import { PenPipe } from '@shared/pipes/pen.pipe'
@Component({
  selector: 'app-attendance-index',
  imports: [
    AttendanceIndexRowComponent,
    MinutesToHoursPipe,
    PenPipe
  ],
  templateUrl: './attendance-index.component.html',
  styleUrl: './attendance-index.component.scss'
})
export class AttendanceIndexComponent implements OnChanges, OnInit {


  @Input() employee: any 

  sum_minutes_ideal: number = 0;
  sum_minutes_worked: number = 0;
  sum_minutes_break: number = 0;
  sum_salary_extra: number = 0;

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['attendances']) {
      // this.calculateHours(this.getTotalSeconds());

      this.sum_minutes_ideal = 0;
      this.sum_minutes_worked = 0;
      this.sum_minutes_break = 0;
      this.sum_salary_extra = 0;

      this.attendances.forEach((attendance: any) => {

        this.sum_minutes_ideal += 480;
        this.sum_minutes_break += 60;
        this.sum_minutes_worked += Number(attendance.minutes);
        this.sum_salary_extra += Number(attendance.salary_extra);

      });

      this.sum_minutes_worked = this.sum_minutes_worked - this.sum_minutes_break;

      console.log(this.sum);

    }

  }


  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['attendances']) {
  //     this.emitHoursMinuts.emit(this.hoursMinuts);
  //     this.emitHoursDecimal.emit(this.hoursDecimal);
  //   }
  // }


  private _attendances: any[] = [];

  @Output() emitHoursMinuts = new EventEmitter<any>();
  @Output() emitHoursDecimal = new EventEmitter<any>();


  @Input()

  set attendances(value: any[]) {
    this._attendances = [...(value || [])].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  get attendances(): any[] {
    return this._attendances;
  }



  //nueva forma de calculo

  sum: number = 0;

  ngOnInit(): void {



  }


}
