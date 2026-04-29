import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AttendanceIndexComponent } from 'src/app/views/dashboard/attendances/attendance-index/attendance-index.component';
import { EmployeeAttendanceService } from './employee.attendance.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { LoadingComponent } from 'src/app/views/shared/components/loading/loading.component';
import { HeadTableComponent } from 'src/app/views/shared/components/head-table/head-table.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-attendance-index',
  imports: [
    AttendanceIndexComponent,
    LoadingComponent,
    HeadTableComponent,
    CommonModule
  ],
  templateUrl: './employee-attendance-index.component.html',
  styleUrl: './employee-attendance-index.component.scss'
})
export class EmployeeAttendanceIndexComponent implements OnInit, OnDestroy {

  employe_id: number = 0;
  loading: boolean = false;
  attendances: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private _employeeAttendance: EmployeeAttendanceService
  ) {

    this.route.parent?.params.subscribe(params => {

      this.employe_id = Number(params['employee_id']);
      this._employeeAttendance.setId(this.employe_id);

    });

  }

  ngOnInit(): void {

    this.attendacesInit();

  }

  attendacesInit() {

    this.loading = true;

    this._employeeAttendance.index().pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.attendances = resp.data;
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al traer los datos. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });


  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  receiveAttendances(attendances: any[]) {

    this.attendances = attendances;
  }

  hoursMinuts: string = "";
  hoursDecimal: number = 0;

  receiveHoursMinuts(hoursMinuts: string) {

    this.hoursMinuts = hoursMinuts;

    console.log('Horas y minutos:', hoursMinuts);
  }

  receiveHoursDecimal(hoursDecimal: number) {

    this.hoursDecimal = hoursDecimal;
    console.log('Horas en decimal:', hoursDecimal);
  }

}
