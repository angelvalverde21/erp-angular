import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AttendanceEditComponent } from '../attendance-edit/attendance-edit.component';

@Component({
  selector: 'app-attendance-index',
  imports: [DatePipe, CurrencyPipe, AttendanceEditComponent],
  templateUrl: './attendance-index.component.html',
  styleUrl: './attendance-index.component.scss',
})
export class AttendanceIndexComponent {
  @Input() employee: any;
  @Output() emitHoursMinuts = new EventEmitter<string>();
  @Output() emitHoursDecimal = new EventEmitter<number>();
  @Output() attendanceChanged = new EventEmitter<any>();
  private rows: any[] = [];
  editing: any;
  private modal?: NgbModalRef;

  @Input() set attendances(value: any[] | null) {
    this.rows = [...(value ?? [])].sort((a, b) => b.date.localeCompare(a.date));
  }
  get attendances(): any[] { return this.rows; }
  get workedMinutes(): number { return this.rows.reduce((sum, row) => sum + Number(row.paid_minutes ?? row.minutes_computed ?? 0), 0); }
  get computedDays(): number { return new Set(this.rows.map(row => row.date.slice(0, 10))).size; }
  get lateCount(): number { return this.rows.filter(row => row.is_late).length; }
  get remoteDays(): number { return new Set(this.rows.filter(row => row.work_type === 'home_office').map(row => row.date.slice(0, 10))).size; }
  get missingCount(): number { return this.rows.filter(row => row.missing).length; }
  get attendanceIndependentPay(): boolean { return this.employee?.status !== false && this.employee?.payroll_uses_attendance === false; }
  get adjustmentTotal(): number | null {
    const calculated = this.rows.filter(row => row.salary_extra != null);
    return calculated.length ? Math.round(calculated.reduce((sum, row) => sum + Number(row.salary_extra), 0) * 100) / 100 : null;
  }

  get periodPay(): { base: number; discounts: number; extras: number; net: number } | null {
    const salary = this.employee?.salary;
    if (this.employee?.status === false || this.rows.some(row => row.calculation_excluded)
      || salary == null || !Number.isFinite(Number(salary)) || Number(salary) < 0) return null;
    const base = Math.round(Math.round(Number(salary) * 100) / 2);
    if (this.attendanceIndependentPay) return { base: base / 100, discounts: 0, extras: 0, net: base / 100 };
    if (!this.rows.length || this.rows.some(row => row.salary_extra == null)) return null;
    let discounts = 0, extras = 0;
    for (const row of this.rows) {
      const adjustment = Math.round(Number(row.salary_extra) * 100);
      if (!Number.isFinite(adjustment)) return null;
      discounts += Math.max(0, -adjustment);
      extras += Math.max(0, adjustment);
    }
    return { base: base / 100, discounts: discounts / 100, extras: extras / 100, net: (base - discounts + extras) / 100 };
  }

  constructor(private modalService: NgbModal) {}

  duration(value: number | null): string {
    if (value == null) return '—';
    const minutes = Math.max(0, Math.round(value));
    return Math.floor(minutes / 60) + ' h ' + (minutes % 60).toString().padStart(2, '0') + ' min';
  }

  state(row: any): string {
    if (!row.employee_id) return 'Sin asignar';
    if (row.missing) return 'Falta';
    if (row.missing_text === 'REMOTO') return 'Remoto';
    if (row.missing_text === 'DESCANZO') return 'Descanso';
    if (row.incomplete) return 'Marcación incompleta';
    return row.is_late ? 'Tardanza' : 'Registrada';
  }

  edit(row: any, template: TemplateRef<any>): void {
    this.editing = row;
    this.modal = this.modalService.open(template, { centered: true, backdrop: 'static', size: 'lg' });
  }

  updated(row: any): void {
    const index = this.rows.indexOf(this.editing);
    this.rows = this.rows.map((item, position) => position === index ? row : item);
    this.modal?.close();
    this.attendanceChanged.emit(row);
    this.emitHoursMinuts.emit(this.duration(this.workedMinutes));
    this.emitHoursDecimal.emit(this.workedMinutes / 60);
  }
}
