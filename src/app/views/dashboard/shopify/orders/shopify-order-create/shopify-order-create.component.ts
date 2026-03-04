import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbAccordionModule, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShopifyOrderFormComponent } from '../shopify-order-form/shopify-order-form.component';
import { VariantSearchComponent } from '@dashboard/products/variants/variant-search/variant-search.component';
import { ButtonAddComponent } from '@shared/components/buttons/button-add/button-add.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDolly, faTruck, faBarcode, faUser } from '@fortawesome/free-solid-svg-icons';
import { CommonModule, JsonPipe } from '@angular/common';
import { CourierSearchComponent } from '@dashboard/users/couriers/courier-search/courier-search.component';
import { CourierSelectedComponent } from '@dashboard/users/couriers/courier-selected/courier-selected.component';
import { AddressFormComponent } from '@dashboard/addresses/address-form/address-form.component';
import { AddressCreateComponent } from '@dashboard/addresses/address-create/address-create.component';
import { OrderVariantIndexComponent } from '../order-variant-index/order-variant-index.component';
import { InputGroupComponent } from '@shared/components/form/input-group/input-group.component';
import { VoidIndexComponent } from '@shared/components/void-index/void-index.component';
import { ButtonSaveComponent } from '@shared/components/buttons/button-save/button-save.component';
import { ButtonCheckComponent } from 'src/app/views/shared/components/buttons/button-check/button-check.component';
import { TwoDecimalsDirective } from 'src/app/core/directives/two-decimals.directive';

@Component({
  selector: 'app-shopify-order-create',
  imports: [
    ReactiveFormsModule,
    ShopifyOrderFormComponent,
    VariantSearchComponent,
    ButtonAddComponent,
    FontAwesomeModule,
    JsonPipe,
    CommonModule,
    CourierSearchComponent,
    CourierSelectedComponent,
    AddressFormComponent,
    AddressCreateComponent,
    OrderVariantIndexComponent,
    InputGroupComponent,
    NgbAccordionModule,
    VoidIndexComponent,
    ButtonSaveComponent,
    ButtonCheckComponent,
    TwoDecimalsDirective
  ],
  templateUrl: './shopify-order-create.component.html',
  styleUrl: './shopify-order-create.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ShopifyOrderCreateComponent {

  form!: FormGroup;
  modal: any;

  faDolly = faDolly;
  faTruck = faTruck;
  faBarcode = faBarcode;
  faUser = faUser;

  constructor(
    private fb: FormBuilder,
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  summary: any;

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
      identity_id: [1, Validators.required],
      document_number: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      primary: ['', Validators.required],
      secondary: [''],
      references: [''],
      district_id: ['', Validators.required],
      variants: this.fb.array([]), // Aquí se agregarán los variants del pedido
      courier_address_id: [null, Validators.required],
      delivery_cost: ['', Validators.required],
      quantity: ['', Validators.required],
      price: ['', Validators.required],
    });

  }


  createOrderShopify() {

  }

  couriersInit() {

  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true, size: 'lg' });
  }
  ngOnDestroy(): void {

  }

  closeModal() {
    this.modal.close();
  }


  // Getter para tipar mejor
  get variants(): FormArray<FormGroup> {
    return this.form.get('variants') as FormArray<FormGroup>;
  }
  variants_selected: any[] = []; // Aquí se almacenarán los variants seleccionados

  //Variantes seleccionadas
  receiveVariantsSelected(variants: any[]) {

    variants.forEach(variant => {

      const exists = this.variants.controls.find(control =>
        control.get('id')?.value === variant.id
      );

      if (exists) return;

      const group = this.fb.group({
        id: [variant.id],
        sku: [variant.sku],
        name: [variant.product.name],
        variant_option_values: [variant.variant_option_values],
        quantity: [variant.quantity || 1],
        price: [variant.price]
      });

      this.variants.push(group);

    });

  }

  gotoVariants() {

    this.form.markAllAsTouched();

    // this.accordion.tooggle('second');

  }


  is_cash_on_delivery: boolean = false;
  is_express_shipping: boolean = false;
  is_freight_collect: boolean = false;

  receiveCourierSelected(courier: any) {
    console.log('Courier seleccionado', courier);

      this.is_cash_on_delivery = courier.is_cash_on_delivery;
      this.is_express_shipping = courier.is_express_shipping;
      this.is_freight_collect = courier.is_freight_collect;

  }
}
