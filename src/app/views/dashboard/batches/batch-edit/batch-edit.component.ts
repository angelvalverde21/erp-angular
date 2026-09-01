import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonSaveComponent } from 'src/app/views/shared/components/buttons/button-save/button-save.component';

@Component({
  selector: 'app-batch-edit',
  imports: [
    
  ],
  templateUrl: './batch-edit.component.html',
  styleUrl: './batch-edit.component.scss'
})
export class BatchEditComponent {


  @Input() batch: any; 

  @Output() emitBatchUpdate = new EventEmitter<any>();
  

}
