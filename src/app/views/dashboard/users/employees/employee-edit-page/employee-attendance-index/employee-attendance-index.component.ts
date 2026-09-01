import { Component, effect, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { AttendanceCreateComponent } from 'src/app/views/dashboard/attendances/attendance-create/attendance-create.component';

import { ActivatedRoute } from '@angular/router';
import { AttendanceIndexComponent } from 'src/app/views/dashboard/attendances/attendance-index/attendance-index.component';
import { EmployeeAttendanceService } from './employee.attendance.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { LoadingComponent } from 'src/app/views/shared/components/loading/loading.component';
import { HeadTableComponent } from 'src/app/views/shared/components/head-table/head-table.component';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../employee.service';
import { HeadSearchComponent } from 'src/app/views/shared/components/head-search/head-search.component';
import { ButtonAddComponent } from 'src/app/views/shared/components/buttons/button-add/button-add.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-employee-attendance-index',
  imports: [
    AttendanceIndexComponent,
    LoadingComponent,
    HeadTableComponent,
    CommonModule,
    HeadSearchComponent,
    ButtonAddComponent,
    AttendanceCreateComponent
  ],
  templateUrl: './employee-attendance-index.component.html',
  styleUrl: './employee-attendance-index.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class EmployeeAttendanceIndexComponent implements OnInit, OnDestroy {

  employee_id: number = 0;
  loading: boolean = false;
  attendances: any[] = [];

  employee: any;

  constructor(
    private route: ActivatedRoute,
    private _employeeAttendance: EmployeeAttendanceService,
    private _employee: EmployeeService,
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {


    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;

    this.route.parent?.params.subscribe(params => {

      this.employee_id = Number(params['employee_id']);
      this._employeeAttendance.setId(this.employee_id);

    });

    effect(() => {

      const event = this._employee.receiveSignal();
      if (!event) return;

      this.employee = event;

      this.attendances = this.employee.attendances;
      
    });

  }

  ngOnInit(): void {

    // this.attendacesInit();

  }

  // attendacesInit() {

  //   this.loading = true;

  //   this._employeeAttendance.index().pipe(takeUntil(this.destroy$)).subscribe({

  //     next: (resp: any) => {
  //       console.log(resp);
  //       this.attendances = resp.data;
  //       this.loading = false;
  //     },

  //     error: (error: any) => {
  //       Swal.fire('Error', 'Ocurrió un problema al traer los datos. Inténtalo nuevamente.', 'error');
  //       console.error(error);
  //     },

  //   });


  // }

  receiveAttendanceCreate(event: any){
    console.log(event);
    
    this.attendances = [...this.attendances, event];
    this.closeModal();
  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  receiveAttendances(attendances: any[]) {

    console.log(attendances);

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

  modal: any;

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true });
  }

  closeModal() {
    this.modal.close();
  }

}


