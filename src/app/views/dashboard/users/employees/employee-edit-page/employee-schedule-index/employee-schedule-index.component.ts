import { Component, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeScheduleService } from './employe.schedule.service';
import { EmployeeService } from '../../employee.service';
import { ScheduleIndexComponent } from '../../../../schedules/schedule-index/schedule-index.component';
import { HeadPageComponent } from '@shared/components/head-page/head-page.component'
import { ButtonLinkComponent } from '@shared/components/buttons/button-link/button-link.component';
import { ScheduleCreateComponent } from '../../../../schedules/schedule-create/schedule-create.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';

@Component({
  selector: 'app-employee-schedule-index',
  imports: [
    ScheduleIndexComponent,
    HeadPageComponent,
    ButtonLinkComponent,
    ScheduleCreateComponent,
    LoadingComponent
  ],
  templateUrl: './employee-schedule-index.component.html',
  styleUrl: './employee-schedule-index.component.scss'
})
export class EmployeeScheduleIndexComponent {

  employee_id: number = 0;
  employee: any;
  schedules: any[] = [];
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private _employeeSchedule: EmployeeScheduleService,
    private _employee: EmployeeService
  ) {

    this.route.parent?.params.subscribe(params => {

      this.employee_id = Number(params['employee_id']);
      this._employeeSchedule.setId(this.employee_id);

    });

    effect(() => {

      const event = this._employee.receiveSignal();
      if (!event) return;
    
      this.employee = event;

      this.schedules = this.employee.schedules;

    });

  }

}
