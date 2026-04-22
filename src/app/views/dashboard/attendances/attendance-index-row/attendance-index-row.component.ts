import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { DayOfWeekPipe } from '../../../shared/pipes/dayOfWeek.pipe';
import { WorkedHoursPipe } from '../../../shared/pipes/workedHours.pipe';
import { AttendanceStatusPipe } from '../../../shared/pipes/attendanceStatus';
import { LateStatusPipe } from '../../../shared/pipes/lateStatus';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faCircleCheck, faCircleXmark, faEdit, faReceipt } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonEditComponent } from 'src/app/views/shared/components/buttons/button-edit/button-edit.component';
import { AttendanceEditComponent } from '../attendance-edit/attendance-edit.component';

@Component({
  selector: 'tr[app-attendance-index-row]',
  imports: [
    DayOfWeekPipe,
    WorkedHoursPipe,
    AttendanceStatusPipe,
    LateStatusPipe,
    FontAwesomeModule,
    CommonModule,
    NgbDropdownModule,
    ButtonEditComponent,
    AttendanceEditComponent,
    NgbTooltipModule
  ],
  templateUrl: './attendance-index-row.component.html',
  styleUrl: './attendance-index-row.component.scss',
  encapsulation: ViewEncapsulation.None,

})
export class AttendanceIndexRowComponent {


  modal: any;
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }
  openVerticallyCentered(content: TemplateRef<any>, attendance: any) {

    this.modal = this.modalService.open(content, { centered: true });
    this.attendance = attendance;

  }


  faCircleCheck = faCircleCheck;
  faCheck = faCheck;
  faCircleXmark = faCircleXmark;
  faEdit = faEdit;
  faReceipt = faReceipt;

  @Input() attendance: any;
  @Input() icon: any;

  closeModal() {
    this.modal.close();
  }

  receiveAttendanceUpdate(attendance: any) {
    this.attendance = { ...this.attendance, ...attendance };
    this.closeModal();
  }

}

