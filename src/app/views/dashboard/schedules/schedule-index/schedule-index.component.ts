import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { VoidIndexComponent } from '@shared/components/void-index/void-index.component';
import { ButtonAddComponent } from '@shared/components/buttons/button-add/button-add.component';
import { ScheduleIndexRowComponent } from '../schedule-index-row/schedule-index-row.component';
import { ScheduleCreateComponent } from '../schedule-create/schedule-create.component';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-schedule-index',
  imports: [
    VoidIndexComponent,
    ButtonAddComponent,
    ScheduleIndexRowComponent,
    ScheduleCreateComponent,
    FontAwesomeModule
  ],
  templateUrl: './schedule-index.component.html',
  styleUrl: './schedule-index.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class ScheduleIndexComponent implements OnInit, OnDestroy {

  faClock = faClock;

  @Input() schedules: any[] = [];

  @Input() employee_id: number = 0;

  modal: any;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }
  
  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true, size: 'lg' });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  closeModal() {
    this.modal.close();
  }

  receiveRemoveschedule(schedule: any) {
    this.closeModal();
  }

  receiveCreateSchedule(schedule: any) {

    console.log(schedule);
    this.closeModal();
    this.schedules.push(schedule);

  }

}
