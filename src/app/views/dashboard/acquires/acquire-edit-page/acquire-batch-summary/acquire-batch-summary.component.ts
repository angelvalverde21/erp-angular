import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBarcode } from '@fortawesome/free-solid-svg-icons';
import { ButtonAddComponent } from 'src/app/views/shared/components/buttons/button-add/button-add.component';

@Component({
  selector: 'app-acquire-batch-summary',
  imports: [
    ButtonAddComponent,
    FontAwesomeModule
  ],
  templateUrl: './acquire-batch-summary.component.html',
  styleUrl: './acquire-batch-summary.component.scss'
})
export class AcquireBatchSummaryComponent {


  faBarcode = faBarcode;
  text_button: string = 'Agregar producto';

}
