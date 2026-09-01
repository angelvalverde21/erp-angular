import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BatchCreateComponent } from '../batch-create/batch-create.component';
import { ButtonAddComponent } from '../../../shared/components/buttons/button-add/button-add.component';

import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-batch-index',
  imports: [
    RouterModule,
    BatchCreateComponent,
    ButtonAddComponent
  ],
  templateUrl: './batch-index.component.html',
  styleUrl: './batch-index.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class BatchIndexComponent implements OnInit, OnDestroy{


  @Input() batches: any[] = []; 
  @Input() title: string = 'Registrar Lotes'; 

  @Input() type: string = ''; 

  
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
    this.modal = this.modalService.open(content, { centered: true, size: 'xl' });
  }


  ngOnInit(): void {
  }
  ngOnDestroy(): void {
  }
  closeModal(){
    this.modal.close();
  }

  receiveBatchCreate(event: any) {
    console.log('Evento recibido en BatchIndexComponent:', event);
    this.batches = [...this.batches, ...event];
    this.closeModal();
  }
  
}
