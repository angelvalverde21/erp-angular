import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-employee-index',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './employee-index.component.html',
  styleUrl: './employee-index.component.scss',
})
export class EmployeeIndexComponent {
  @Input() employees: any[] = [];

  initials(name: string): string {
    return name.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  }
}
