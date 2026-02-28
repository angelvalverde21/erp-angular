import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShopifyOrderFormComponent } from '../shopify-order-form/shopify-order-form.component';

@Component({
  selector: 'app-shopify-order-create',
  imports: [
    ReactiveFormsModule,
    ShopifyOrderFormComponent
  ],
  templateUrl: './shopify-order-create.component.html',
  styleUrl: './shopify-order-create.component.scss'
})
export class ShopifyOrderCreateComponent {

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) {

  }

  ngOnInit(): void {
    this.formInit();
    // this.productSetup();
    // this.form.patchValue(this.product);
  }


  private formInit(): void {
    // this.form = this.fb.group({
    //   origin_id: ['', [Validators.required]],
    //   // color: ['', [Validators.required]],
    //   delivery_method_id: ['', [Validators.required]],
    //   contra_entrega: ['', [Validators.required]],
    //   acepta_pago_destino: ['', [Validators.required]],
    //   envio_es: ['', [Validators.required]],
    //   address: ['']
    // });

    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.email],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: ['', Validators.required],
    });
    
  }

  createOrderShopify() {

  }

}
