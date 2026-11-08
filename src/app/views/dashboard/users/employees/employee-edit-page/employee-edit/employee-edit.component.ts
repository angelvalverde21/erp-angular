import { Component, effect, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';
import { EmployeeService } from '../../employee.service';
import { EmployeeFormComponent } from '../../employee-form/employee-form.component';
import { createEmployeeForm, employeeError, employeePayload } from '../../employee-form.model';
import { RoleService } from '../../../../roles/role.service';
import { dashboardRoles, MANAGEMENT_ROLES } from '../../../../area-dashboards/dashboard.model';

@Component({
  selector: 'app-employee-edit',
  imports: [ReactiveFormsModule, EmployeeFormComponent],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.scss',
})
export class EmployeeEditComponent implements OnDestroy {
  @Input() employee: any;
  @Input() roles: any[] = [];
  form: FormGroup;
  loadingIcon = false;
  error = '';
  readonly canEdit = dashboardRoles().some(role => MANAGEMENT_ROLES.includes(role));
  private readonly destroy$ = new Subject<void>();

  constructor(fb: FormBuilder, private service: EmployeeService, roleService: RoleService) {
    this.form = createEmployeeForm(fb, false);
    if (!this.canEdit) this.form.disable();
    roleService.index().pipe(takeUntil(this.destroy$)).subscribe({
      next: (response: any) => this.roles = response.data,
      error: () => this.roles = [],
    });
    effect(() => {
      const employee = this.service.receiveSignal();
      if (!employee) return;
      this.employee = employee;
      this.form.patchValue({ ...employee, email: employee.email ?? employee.account?.email ?? '', roles: employee.roles ?? [], password: '', password_confirmation: '' });
    });
  }

  save(): void {
    if (!this.canEdit || this.loadingIcon) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loadingIcon = true;
    this.error = '';
    this.service.update(this.employee.id, employeePayload(this.form.getRawValue())).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loadingIcon = false),
    ).subscribe({
      next: (response: any) => {
        this.service.setSignal({ ...this.employee, ...response.data });
        this.form.markAsPristine();
      },
      error: error => this.error = employeeError(error),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
