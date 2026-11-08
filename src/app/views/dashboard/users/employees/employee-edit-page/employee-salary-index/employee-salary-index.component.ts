import { Component, OnDestroy, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { EmployeeService } from '../../employee.service';
import { AttendanceIndexComponent } from '../../../../attendances/attendance-index/attendance-index.component';

@Component({
  selector: 'app-employee-salary-index',
  imports: [CurrencyPipe, DatePipe, AttendanceIndexComponent],
  templateUrl: './employee-salary-index.component.html',
  styleUrl: './employee-salary-index.component.scss',
})
export class EmployeeSalaryIndexComponent implements OnInit, OnDestroy {
  employee: any;
  periods: any[] = [];
  loading = false;
  error = '';
  openPeriod = '';
  private employeeId = 0;
  private readonly destroy$ = new Subject<void>();

  constructor(private service: EmployeeService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.parent?.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.employeeId = Number(params['employee_id']);
      this.load();
    });
  }

  load(): void {
    if (this.loading || !this.employeeId) return;
    this.loading = true;
    this.error = '';
    this.service.laborSummary(this.employeeId).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading = false),
    ).subscribe({
      next: response => {
        this.employee = response.data.employee;
        this.periods = response.data.periods;
        if (!this.openPeriod) this.openPeriod = this.periods[0]?.id ?? '';
      },
      error: () => this.error = 'No se pudieron cargar las últimas quincenas. Inténtalo nuevamente.',
    });
  }

  duration(value: number): string {
    const minutes = Math.max(0, Math.round(value));
    return Math.floor(minutes / 60) + ' h ' + (minutes % 60).toString().padStart(2, '0') + ' min';
  }

  toggle(id: string): void {
    this.openPeriod = this.openPeriod === id ? '' : id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
