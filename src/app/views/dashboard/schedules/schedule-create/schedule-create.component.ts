import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; //Colocar esto arriba en los imports
import { ScheduleFormComponent } from '../schedule-form/schedule-form.component';
import { ButtonSaveComponent } from 'src/app/views/shared/components/buttons/button-save/button-save.component';
import { JsonPipe } from '@angular/common';
import { Subject } from 'rxjs';

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
export class ScheduleCreateComponent implements OnInit, OnDestroy{

  
  constructor(
  private fb: FormBuilder,
  private _schedule: ScheduleService
  ){}
  
  form!: FormGroup;

  formInit(){ 

    this.form = this.fb.group({
      work_type: ["onsite", Validators.required],
      start_time: ["09:00", Validators.required],
      end_time: ["17:00", Validators.required],
      day_of_week: ["1", Validators.required],
      allow_extra_hours: [1, Validators.required],
    });

  }

  ngOnInit(): void {
    this.formInit();
  }

  formValid(value: boolean) {

  }
  
  create(){

    this.loading = true;

    this._scheduleService.create(this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        this.s = resp.data;
        this.loading = false;
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
