import { Component } from '@angular/core';
import { ButtonLinkComponent } from '../../shared/components/buttons/button-link/button-link.component';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { BatchCreateComponent } from '../batch-create/batch-create.component';
@Component({
  selector: 'app-batche-create-page',
  imports: [BatchCreateComponent, ButtonLinkComponent],
  templateUrl: './batche-create-page.component.html',
  styleUrl: './batche-create-page.component.scss'
})
export class BatchCreatePageComponent {

    faArrowLeft = faArrowLeft;
  
    receiveBatcheCreate(Batche: any) {}

}
