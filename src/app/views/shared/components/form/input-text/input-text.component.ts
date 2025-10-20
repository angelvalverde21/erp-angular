import { Component, Input } from '@angular/core';
import {
  FormControlDirective,
  FormLabelDirective,
  InputGroupComponent,
  InputGroupTextDirective
} from '@coreui/angular';

@Component({
  selector: 'app-input-text',
  imports: [InputGroupComponent, InputGroupTextDirective, FormControlDirective, FormLabelDirective],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss'
})
export class InputTextComponent {

  @Input() name: string = ""; 
  

}
