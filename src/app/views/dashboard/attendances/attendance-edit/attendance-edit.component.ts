import { JsonPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; //Colocar esto arriba en los imports
import { Subject, takeUntil } from 'rxjs';
import { ButtonSaveComponent } from 'src/app/views/shared/components/buttons/button-save/button-save.component';
import { InputGroupComponent } from 'src/app/views/shared/components/form/input-group/input-group.component';
import { AttendanceService } from '../attendance.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-attendance-edit',
  imports: [
    ReactiveFormsModule,
    InputGroupComponent,
    ButtonSaveComponent,
    JsonPipe
  ],
  templateUrl: './attendance-edit.component.html',
  styleUrl: './attendance-edit.component.scss'
})
export class AttendanceEditComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private _attendance: AttendanceService
  ) { }


  @Input() attendance: any;

  @Output() emitAttendanceUpdate = new EventEmitter<any>();

  form!: FormGroup;

  ngOnInit(): void {
    console.log(this.attendance);
    console.log(this.attendance?.id);

    this.formInit();
    this.form.patchValue(this.attendance);
  }

  formInit() {
    this.form = this.fb.group({
      date: [{ value: '', disabled: true }],
      check_in: ['', Validators.required],
      check_out: ['', Validators.required],
      employee_id: [this.attendance.employee_id, Validators.required],
      comment: [''],
    });
  }

  loading: boolean = false;

  createOrUpdate() {

    console.log(this.form.getRawValue());
    
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log("createOrUpdate");
    

    if (this.attendance?.id === null) {
      this.create();
    }else{
      this.update();
    }

  }

  update() {

    this.loading = true;
    

    this._attendance.update(this.attendance.id, this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'El registro ha sido actualizado', 'success');
        console.log(resp);
        this.attendance = resp.data;
        this.loading = false;

        this.emitAttendanceUpdate.emit(this.attendance);
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al actualizar. Inténtalo nuevamente.', 'error');
        console.error(error);
        this.loading = false;
      },

    });

  }

  create() {

    this.loading = true;

    this._attendance.store(this.form.getRawValue()).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        this.attendance = resp.data;
        this.loading = false;

        this.emitAttendanceUpdate.emit(this.attendance);
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al actualizar. Inténtalo nuevamente.', 'error');
        console.error(error);
        this.loading = false;
      },

    });
  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

}

