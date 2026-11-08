import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { EmployeeService } from '../employee.service';
import { EmployeeIndexComponent } from '../employee-index/employee-index.component';
import { dashboardRoles, MANAGEMENT_ROLES } from '../../../area-dashboards/dashboard.model';

@Component({
  selector: 'app-employee-index-page',
  imports: [FormsModule, RouterLink, EmployeeIndexComponent],
  templateUrl: './employee-index-page.component.html',
  styleUrl: './employee-index-page.component.scss',
})
export class EmployeeIndexPageComponent implements OnInit, OnDestroy {
  employees: any[] = [];
  search = '';
  status = '';
  loading = false;
  error = '';
  readonly canEdit = dashboardRoles().some(role => MANAGEMENT_ROLES.includes(role));
  private readonly destroy$ = new Subject<void>();

  constructor(private service: EmployeeService) {}

  get activeCount(): number {
    return this.employees.filter(employee => employee.status).length;
  }

  get clockCount(): number {
    return this.employees.filter(employee => employee.biometric_code || employee.document_number).length;
  }

  get filteredEmployees(): any[] {
    const term = this.search.trim().toLocaleLowerCase();
    return this.employees.filter(employee => (
      !term || [employee.name, employee.email, employee.account?.email, employee.phone, employee.document_number, employee.biometric_code]
        .some(value => String(value ?? '').toLocaleLowerCase().includes(term))
    ) && (this.status === '' || Number(employee.status) === Number(this.status)));
  }

  ngOnInit(): void {
    this.employeesInit();
  }

  employeesInit(): void {
    this.loading = true;
    this.error = '';
    this.service.index().pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
      next: (response: any) => this.employees = response.data,
      error: () => this.error = 'No se pudo cargar el equipo. Inténtalo nuevamente.',
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
