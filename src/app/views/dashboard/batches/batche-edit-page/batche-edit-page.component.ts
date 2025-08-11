import { Component } from '@angular/core';
import { ButtonLinkComponent } from '../../shared/components/buttons/button-link/button-link.component';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { BatcheEditComponent } from '../batche-edit/batche-edit.component';

@Component({
  selector: 'app-batche-edit-page',
  imports: [BatcheEditComponent, ButtonLinkComponent],
  templateUrl: './batche-edit-page.component.html',
  styleUrl: './batche-edit-page.component.scss'
})
export class BatcheEditPageComponent {

    faArrowLeft = faArrowLeft;
  
    receiveBatcheEdit(batche: any) {}

}
