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
      check_in: [this.attendance?.check_in ?? ''],
      check_out: [this.attendance?.check_out ?? ''],
      comment: [this.attendance?.comment ?? '', Validators.maxLength(250)],
    });
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
