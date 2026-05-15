import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-schedule-index',
  imports: [],
  templateUrl: './schedule-index.component.html',
  styleUrl: './schedule-index.component.scss'
})
export class ScheduleIndexComponent {


  @Input() schedules: any[] = []; 

}
