import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-button-print',
  imports: [
    ButtonComponent,
    FontAwesomeModule
  ],
  templateUrl: './button-print.component.html',
  styleUrl: './button-print.component.scss'
})
export class ButtonPrintComponent {

  faPrint = faPrint;

}
