import { Component } from '@angular/core';
import { InputGroupComponent } from '../../../shared/form/input-group/input-group.component';
import { ButtonAddComponent } from '../../../shared/components/buttons/button-add/button-add.component';


@Component({
  selector: 'app-options',
  imports: [InputGroupComponent, ButtonAddComponent],
  templateUrl: './options.component.html',
  styleUrl: './options.component.scss'
})
export class OptionsComponent {

}
