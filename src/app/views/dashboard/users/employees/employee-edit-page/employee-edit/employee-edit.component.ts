import { Component, effect, Input, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { EmployeeFormComponent } from '../../employee-form/employee-form.component';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { JsonPipe } from '@angular/common';
import { HeadTableComponent } from 'src/app/views/shared/components/head-table/head-table.component';
import { UserControlsUpdateComponent } from '../../../shared/user-controls-update/user-controls-update.component';
import { EmployeeService } from '../../employee.service';
import { HeadPageComponent } from 'src/app/views/shared/components/head-page/head-page.component';
import { ButtonLinkComponent } from 'src/app/views/shared/components/buttons/button-link/button-link.component';
// import { ScheduleIndexComponent } from '@dashboard/schedules/schedule-index/schedule-index.component';
import { ScheduleIndexComponent } from '@dashboard/schedules/schedule-index/schedule-index.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ScheduleCreateComponent } from '../../../../schedules/schedule-create/schedule-create.component';


@Component({
  selector: 'app-employee-edit',
  imports: [
    EmployeeFormComponent,
    ButtonComponent,
    UserControlsUpdateComponent,
    JsonPipe,
    HeadTableComponent,
    HeadPageComponent,
    ButtonLinkComponent,
    ScheduleIndexComponent,
    ScheduleCreateComponent
  ],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class EmployeeEditComponent implements OnDestroy {

  disabledButton: boolean = false;
  loadingIcon: boolean = false;
  form!: FormGroup;
  @Input() employee!: any;

  @Input() roles: any;
  faSave = faSave;

  constructor(
    private fb: FormBuilder,
    private _employee: EmployeeService,
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {

    config.backdrop = 'static';
    config.keyboard = false;

    this.formInit();

    effect(() => {

      this.employee = this._employee.receiveSignal();
      console.log(this.employee);
      if (!this.employee) return;

      this.form.patchValue({
        name: this.employee.user.name,
        email: this.employee.user.email,
        phone: this.employee.user.phone,
        status: this.employee.user.status,
        document_number: this.employee.user.document_number,
        identity_id: this.employee.user.identity_id,
        tag_sales: this.employee.tag_sales,
        roles: this.employee.user.roles,               // ya es array ['produccion','compras']
        salary: this.employee?.salary,    //aquí se anida el salario
        type: this.employee?.type,    //aquí se anida el tipo
        comission: this.employee?.comission,
        work_time_start: this.employee?.work_time_start,
        work_time_end: this.employee?.work_time_end,
        auto_close_end_time: this.employee?.auto_close_end_time,
      });

    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!user.roles.includes('master') && !user.roles.includes('ceo')) {
      this.form.disable();
    }

  }
  // ngOnInit(): void {

  //   this.formInit();
  //   // this.form.patchValue(this.employee);

  //   this.form.patchValue({
  //     name: this.employee.user.name,
  //     email: this.employee.user.email,
  //     phone: this.employee.user.phone,
  //     status: this.employee.user.status,
  //     document_number: this.employee.user.document_number,
  //     identity_id: this.employee.user.identity_id,
  //     tag_sales: this.employee.tag_sales,
  //     roles: this.employee.user.roles,               // ya es array ['produccion','compras']
  //     salary: this.employee?.salary,    //aquí se anida el salario
  //     comission: this.employee?.comission
  //   });

  // }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  private formInit(): void {

    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      document_number: ['', [Validators.required]],
      identity_id: ['', [Validators.required]],
      status: ['', [Validators.required]],
      roles: ['', [Validators.required]],
      salary: ['', [Validators.required]],
      type: ['fulltime', [Validators.required]],
      work_time_start: ['', [Validators.required]],
      work_time_end: ['', [Validators.required]],
      auto_close_end_time: ['', [Validators.required]],
      tag_sales: [''],
      comission: [''],
    });

  }

  modal: any;

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true, size: 'lg' });
  }

  closeModal() {
    this.modal.close();
  }

}


