import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; //Colocar esto arriba en los imports
import { ScheduleFormComponent } from '../schedule-form/schedule-form.component';
import { ButtonSaveComponent } from 'src/app/views/shared/components/buttons/button-save/button-save.component';
import { JsonPipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';
import { EmployeeScheduleService } from '@dashboard/users/employees/employee-edit-page/employee-schedule-index/employe.schedule.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-schedule-create',
  imports: [
    ReactiveFormsModule,
    ScheduleFormComponent,
    ButtonSaveComponent,
    JsonPipe
  ],
  templateUrl: './schedule-create.component.html',
  styleUrl: './schedule-create.component.scss'
})
export class ScheduleCreateComponent implements OnInit, OnDestroy {

  @Input() employee_id: number = 0;

  @Output() emitCreateSchedule = new EventEmitter<any>();

  schedule = {};

  constructor(
    private fb: FormBuilder,
    private _employeeSchedule: EmployeeScheduleService
  ) { }

  form!: FormGroup;

  formInit() {

    this.form = this.fb.group({
      work_type: ["onsite", Validators.required],
      start_time: ["10:00", Validators.required],
      end_time: ["19:00", Validators.required],
      day_of_week: ["1", Validators.required],
      allow_extra_hours: [0, Validators.required],
      comments: [""],
    });

  }

  ngOnInit(): void {
    this.formInit();
  }

  formValid(value: boolean) {

  }

  loading: boolean = false;

  create() {

    console.log(this.form.value);

    this.loading = true;

    this._employeeSchedule.setId(this.employee_id);

    this._employeeSchedule.store(this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {

        Swal.fire({
          icon: 'success',
          title: 'Guardado',
          text: 'El registro ha sido creado',
          timer: 1500,          // 1.5 segundos
          showConfirmButton: false
        });
        
        console.log(resp);

        this.schedule = resp.data;
        this.loading = false;
        console.log("respuesta recibida del servidor");
        this.emitCreateSchedule.emit(this.schedule);
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
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
