import { Component, EventEmitter, Input, Output, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ButtonEditComponent } from 'src/app/views/shared/components/buttons/button-edit/button-edit.component';
import { DayOfWeekPipe } from 'src/app/views/shared/pipes/dayOfWeek.pipe';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ScheduleEditComponent } from '../schedule-edit/schedule-edit.component';

@Component({
  selector: 'tr[app-schedule-index-row]',
  imports: [
    DayOfWeekPipe,
    ButtonEditComponent,
    ScheduleEditComponent
  ],
  templateUrl: './schedule-index-row.component.html',
  styleUrl: './schedule-index-row.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ScheduleIndexRowComponent implements OnInit, OnDestroy {

  @Input() employee_id: number = 0;

  @Input() schedule: any;

  @Output() emitRemoveSchedule = new EventEmitter<number>();

  modal: any;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
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

  receiveUpdatedSchedule(event: any){
    console.log("receiveUpdatedSchedule");
    
    this.schedule = event;
  }

}

