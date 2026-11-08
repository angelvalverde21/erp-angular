import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-employee-widget',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './employee-widget.component.html',
  styleUrl: './employee-widget.component.scss',
})
export class EmployeeWidgetComponent {
  @Input() summary: any;
  readonly sections = [
    { title: 'Ficha del empleado', path: './', icon: 'fa-user', exact: true },
    { title: 'Horarios', path: './schedules', icon: 'fa-clock', exact: false },
    { title: 'Asistencias', path: './attendances', icon: 'fa-calendar-check', exact: false },
    { title: 'Resumen laboral', path: './salaries', icon: 'fa-chart-simple', exact: false },
    { title: 'Movimientos', path: './payments', icon: 'fa-wallet', exact: false },
  ];
}
