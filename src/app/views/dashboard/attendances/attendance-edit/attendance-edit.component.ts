import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AttendanceService } from '../attendance.service';
import { EmployeeSelectedComponent } from '../../users/employees/employee-selected/employee-selected.component';

@Component({
  selector: 'app-attendance-edit',
  imports: [ReactiveFormsModule, EmployeeSelectedComponent],
  templateUrl: './attendance-edit.component.html',
  styleUrl: './attendance-edit.component.scss',
})
export class AttendanceEditComponent implements OnInit, OnDestroy {
  @Input() attendance: any;
  @Output() emitAttendanceUpdate = new EventEmitter<any>();
  form!: FormGroup;
  loading = false;
  error = '';
  private readonly destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private service: AttendanceService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      date: [this.attendance?.date ?? '', Validators.required],
      employee_id: [this.attendance?.employee_id ?? null, Validators.required],
      work_type: [this.attendance?.work_type === 'home_office' ? 'home_office' : 'onsite', Validators.required],
      remote_hours_custom: [this.attendance?.remote_hours_custom ?? false],
      check_in: [this.attendance?.check_in ?? ''],
      check_out: [this.attendance?.check_out ?? ''],
      break_skipped: [this.attendance?.break_skipped ?? false],
      comment: [this.attendance?.comment ?? '', Validators.maxLength(250)],
    });
    this.form.controls['remote_hours_custom'].valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.updateRemoteHours());
    this.form.controls['work_type'].valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.updateRemoteHours());
    this.updateRemoteHours();
  }

  toggleRemoteHours(): void {
    const control = this.form.controls['remote_hours_custom'];
    if (!control.value) {
      this.form.patchValue({
        check_in: this.form.value.check_in || this.attendance?.scheduled_start || '',
        check_out: this.form.value.check_out || this.attendance?.scheduled_end || '',
      });
    }
    control.setValue(!control.value);
  }

  private updateRemoteHours(): void {
    const required = this.form.value.work_type === 'home_office' && this.form.value.remote_hours_custom;
    for (const name of ['check_in', 'check_out']) {
      this.form.controls[name].setValidators(required ? Validators.required : null);
      this.form.controls[name].updateValueAndValidity({ emitEvent: false });
    }
  }

  createOrUpdate(): void {
    if (this.loading) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    const values = Object.fromEntries(Object.entries(this.form.getRawValue()).map(([key, value]) => [key, value === '' ? null : value]));
    if (values['work_type'] === 'home_office' && !values['remote_hours_custom']) {
      values['check_in'] = null;
      values['check_out'] = null;
    }
    const operation = this.attendance?.id
      ? this.service.update(this.attendance.id, values)
      : this.service.store(values);
    operation.pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
      next: (response: any) => this.emitAttendanceUpdate.emit(response.data),
      error: error => this.error = error.error?.errors
        ? Object.values(error.error.errors).flat().join(' ')
        : 'No se pudo guardar la asistencia. Inténtalo nuevamente.',
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
