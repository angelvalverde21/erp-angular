import { Component } from '@angular/core';
import { ButtonLinkComponent } from '../../shared/components/buttons/button-link/button-link.component';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { BatcheCreateComponent } from '../batche-create/batche-create.component';
@Component({
  selector: 'app-batche-create-page',
  imports: [BatcheCreateComponent, ButtonLinkComponent],
  templateUrl: './batche-create-page.component.html',
  styleUrl: './batche-create-page.component.scss'
})
export class BatcheCreatePageComponent {

    faArrowLeft = faArrowLeft;
  
    receiveBatcheCreate(Batche: any) {}

}
