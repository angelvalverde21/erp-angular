import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { faHome, faEnvelope, faPhone, faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { InputGroupComponent } from '@shared/components/form/input-group/input-group.component';
import { VariantSearchComponent } from '../../../products/variants/variant-search/variant-search.component';

@Component({
  selector: 'app-shopify-order-form',
  imports: [
    ReactiveFormsModule,
    InputGroupComponent,
    VariantSearchComponent
  ],
  templateUrl: './shopify-order-form.component.html',
  styleUrl: './shopify-order-form.component.scss'
})
export class ShopifyOrderFormComponent implements OnInit {


  @Input() form!: FormGroup;

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

  receiveSelectedVariants(variants: any[]) {
    console.log('Selected variants:', variants);
    
  }

}
