import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeScheduleService } from '@dashboard/users/employees/employee-edit-page/employee-schedule-index/employe.schedule.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ScheduleFormComponent } from '../schedule-form/schedule-form.component';
import { ButtonSaveComponent } from 'src/app/views/shared/components/buttons/button-save/button-save.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-schedule-edit',
  imports: [
    ReactiveFormsModule,
    ScheduleFormComponent,
    ButtonSaveComponent,
    JsonPipe

  ],
  templateUrl: './schedule-edit.component.html',
  styleUrl: './schedule-edit.component.scss'
})
export class ScheduleEditComponent implements OnInit, OnDestroy{

  @Input() employee_id: number = 0; 
  @Input() schedule: any; 
  @Output() emitUpdatedSchedule = new EventEmitter<number>();
  

  constructor(
    private fb: FormBuilder,
    private _employeeSchedule: EmployeeScheduleService
  ) { }

  ngOnInit(): void {
    this.formInit();
  }

  form!: FormGroup;

  formInit() {

    this.form = this.fb.group({
      work_type: ["", Validators.required],
      start_time: ["", Validators.required],
      end_time: ["", Validators.required],
      day_of_week: ["", Validators.required],
      allow_extra_hours: [, Validators.required],
      comments: [""],
    });

    this.form.patchValue(this.schedule)

  }

  loading: boolean = false;

  update(){

    this.loading = true;

    this._employeeSchedule.setId(this.employee_id)

    this._employeeSchedule.update(this.schedule.id, this.form.value).pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
        Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        this.schedule = resp.data;
        this.loading = false;
        this.emitUpdatedSchedule.emit(this.schedule)
      },
    
      error: (error: any) => {
        Swal.fire('Error','Ocurrió un problema al crear. Inténtalo nuevamente.','error');
        console.error(error);
      },
    
    });

  }

  destroy$ = new Subject<void>();
  
  ngOnDestroy(): void {
  
    this.destroy$.next();
    this.destroy$.complete();
  
  }


}
