import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';
import { EmployeeService } from '../employee.service';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { createEmployeeForm, employeeError, employeePayload } from '../employee-form.model';

@Component({
  selector: 'app-employee-create',
  imports: [ReactiveFormsModule, EmployeeFormComponent],
  templateUrl: './employee-create.component.html',
  styleUrl: './employee-create.component.scss',
})
export class EmployeeCreateComponent implements OnInit, OnDestroy {
  @Input() roles: any[] = [];
  @Output() emitEmployeeCreate = new EventEmitter<any>();
  form: FormGroup;
  loadingIcon = false;
  disabledButton = false;
  error = '';
  private readonly destroy$ = new Subject<void>();

  constructor(fb: FormBuilder, private service: EmployeeService) {
    this.form = createEmployeeForm(fb);
  }

  ngOnInit(): void {}

  create(): void {
    if (this.form.invalid || this.loadingIcon) {
      this.form.markAllAsTouched();
      return;
    }
    this.loadingIcon = this.disabledButton = true;
    this.error = '';
    this.service.store(employeePayload(this.form.getRawValue())).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loadingIcon = this.disabledButton = false),
    ).subscribe({
      next: (response: any) => this.emitEmployeeCreate.emit(response.data),
      error: error => this.error = employeeError(error),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
