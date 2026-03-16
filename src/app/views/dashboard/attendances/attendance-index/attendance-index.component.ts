import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DayOfWeekPipe } from '../../../shared/pipes/dayOfWeek.pipe';
import { faCheck, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { WorkedHoursPipe } from '../../../shared/pipes/workedHours.pipe';
import { AttendanceStatusPipe } from '../../../shared/pipes/attendanceStatus';
import { LateStatusPipe } from '../../../shared/pipes/lateStatus';

@Component({
  selector: 'app-attendance-index',
  imports: [
    CommonModule,
    DayOfWeekPipe,
    FontAwesomeModule,
    WorkedHoursPipe,
    AttendanceStatusPipe,
    LateStatusPipe
  ],
  templateUrl: './attendance-index.component.html',
  styleUrl: './attendance-index.component.scss'
})
export class AttendanceIndexComponent {

  faCircleCheck = faCircleCheck;
  faCheck = faCheck;
  faCircleXmark = faCircleXmark;

  @Input() attendances: any[] = []; 

}
