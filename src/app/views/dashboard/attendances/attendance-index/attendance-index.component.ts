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
  get lateCount(): number { return this.rows.filter(row => row.is_late).length; }
  get missingCount(): number { return this.rows.filter(row => row.missing).length; }

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
