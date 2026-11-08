import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AttendanceEditComponent } from '../attendance-edit/attendance-edit.component';

@Component({
  selector: 'app-attendance-create',
  imports: [AttendanceEditComponent],
  templateUrl: './attendance-create.component.html',
  styleUrl: './attendance-create.component.scss',
})
export class AttendanceCreateComponent {
  @Input() employee_id: number | null = null;
  @Output() emitAttendanceCreate = new EventEmitter<any>();
}
