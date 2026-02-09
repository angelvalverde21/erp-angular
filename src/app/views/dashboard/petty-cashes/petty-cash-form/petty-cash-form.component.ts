import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputGroupComponent } from 'src/app/views/shared/components/form/input-group/input-group.component';
import { EmployeeSelectedComponent } from '../../users/employees/employee-selected/employee-selected.component';
import { JsonPipe } from '@angular/common';
import { GatewaySelectedComponent } from '../../gateways/gateway-selected/gateway-selected.component';

@Component({
  selector: 'app-petty-cash-form',
  imports: [
    InputGroupComponent,
    ReactiveFormsModule,
    EmployeeSelectedComponent,
    JsonPipe,
    GatewaySelectedComponent
  ],
  templateUrl: './petty-cash-form.component.html',
  styleUrl: './petty-cash-form.component.scss'
})
export class PettyCashFormComponent {

    @Input({ required: true }) form!: FormGroup;

}
