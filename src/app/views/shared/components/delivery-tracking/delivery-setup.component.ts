import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { todayInLima } from './delivery-tracking.model';

export function createDeliveryForm(fb: FormBuilder, enabled: boolean): FormGroup {
  return fb.group({ enabled, handed_over_on: [todayInLima()], expected_on: [null] }, {
    validators: (control: AbstractControl) => control.value.enabled && !control.value.expected_on ? { expectedDateRequired: true } : null,
  });
}

@Component({
  selector: 'app-delivery-setup',
  imports: [ReactiveFormsModule],
  templateUrl: './delivery-setup.component.html',
  styleUrl: './delivery-setup.component.scss',
})
export class DeliverySetupComponent {
  @Input({ required: true }) form!: FormGroup;
  readonly today = todayInLima();
}
