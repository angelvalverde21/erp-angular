import { Component, Input } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeePayrollSummary } from './employee-payroll.model';

@Component({
  selector: 'app-employee-payroll',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './employee-payroll.component.html',
  styleUrl: './employee-payroll.component.scss',
})
export class EmployeePayrollComponent {
  @Input({ required: true }) summary!: EmployeePayrollSummary;
  @Input({ required: true }) store = '';
}
