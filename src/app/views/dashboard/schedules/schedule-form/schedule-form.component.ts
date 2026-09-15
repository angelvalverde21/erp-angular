import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-schedule-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './schedule-form.component.html',
  styleUrl: './schedule-form.component.scss'
})
export class ScheduleFormComponent {


  @Input() form!: FormGroup; 

}
