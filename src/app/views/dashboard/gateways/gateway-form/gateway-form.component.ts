import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputGroupComponent } from '@shared/components/form/input-group/input-group.component';

@Component({
  selector: 'app-gateway-form',
  imports: [
    ReactiveFormsModule,
    InputGroupComponent
  ],
  templateUrl: './gateway-form.component.html',
  styleUrl: './gateway-form.component.scss'
})
export class GatewayFormComponent {

  @Input({ required: true }) form!: FormGroup;

}
