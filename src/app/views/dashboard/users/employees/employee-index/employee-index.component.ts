import { Component, Input, OnDestroy } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { EmployeeService } from '../employee.service';
import { dashboardRoles, MANAGEMENT_ROLES } from '../../../area-dashboards/dashboard.model';

@Component({
  selector: 'app-employee-index',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './employee-index.component.html',
  styleUrl: './employee-index.component.scss',
})
export class EmployeeIndexComponent implements OnDestroy {
  @Input() employees: any[] = [];
  readonly canEdit = dashboardRoles().some(role => MANAGEMENT_ROLES.includes(role));
  readonly pending = new Set<number>();
  error = '';
  private readonly destroy$ = new Subject<void>();

  constructor(private service: EmployeeService) {}

  toggleStatus(employee: any): void {
    if (!this.canEdit || this.pending.has(employee.id)) return;
    this.pending.add(employee.id);
    this.error = '';
    this.service.setWorkStatus(employee.id, !employee.status)
      .pipe(takeUntil(this.destroy$), finalize(() => this.pending.delete(employee.id)))
      .subscribe({
        next: response => Object.assign(employee, { status: response.data.status }),
        error: () => this.error = 'No se pudo cambiar el estado del empleado. Inténtalo nuevamente.',
      });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  initials(name: string): string {
    return name.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  }
}
