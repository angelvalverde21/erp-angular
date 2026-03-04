import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { faHome, faEnvelope, faPhone, faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { InputGroupComponent } from '@shared/components/form/input-group/input-group.component';
import { CourierSelectedComponent } from '../../../users/couriers/courier-selected/courier-selected.component';

@Component({
  selector: 'app-shopify-order-form',
  imports: [
    InputGroupComponent,
    CourierSelectedComponent
  ],
  templateUrl: './shopify-order-form.component.html',
  styleUrl: './shopify-order-form.component.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class ShopifyOrderFormComponent implements OnInit {


  // @Input() form!: FormGroup;

  // form!: FormGroup;

  constructor(
    // private fb: FormBuilder
  ) {

  }
  ngOnInit(): void {
    // this.formInit();
  }

  faHome = faHome;
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faAddressCard = faAddressCard;

}
