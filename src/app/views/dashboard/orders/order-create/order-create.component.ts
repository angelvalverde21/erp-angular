import { Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VariantSearchComponent } from '@dashboard/products/variants/variant-search/variant-search.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDolly, faTruck, faBarcode, faUser } from '@fortawesome/free-solid-svg-icons';
import { CurrencyPipe } from '@angular/common';
import { CourierSelectedComponent } from '@dashboard/users/couriers/courier-selected/courier-selected.component';
import { AddressFormComponent } from '@dashboard/addresses/address-form/address-form.component';
import { OrderVariantIndexComponent } from '@dashboard/shopify/orders/order-variant-index/order-variant-index.component';
import { InputGroupComponent } from '@shared/components/form/input-group/input-group.component';
import { ButtonCheckComponent } from 'src/app/views/shared/components/buttons/button-check/button-check.component';
import { TwoDecimalsDirective } from 'src/app/core/directives/two-decimals.directive';
import { finalize, Subject, Subscription, switchMap, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '@dashboard/orders/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-create',
  imports: [
    ReactiveFormsModule,
    VariantSearchComponent,
    FontAwesomeModule,
    CurrencyPipe,
    CourierSelectedComponent,
    AddressFormComponent,
    OrderVariantIndexComponent,
    InputGroupComponent,
    ButtonCheckComponent,
    TwoDecimalsDirective,
  ],
  templateUrl: './order-create.component.html',
  styleUrl: './order-create.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class OrderCreateComponent implements OnInit, OnDestroy {

  get canGenerateOrder(): boolean {
    return this.form.valid && this.completionSteps.every(step => step.complete);
  }

  loading: boolean = false;

  submitOrder(): void {
    if (this.loading) return;

    this.form.markAllAsTouched();
    if (!this.canGenerateOrder) return;

    const {
      name, identity_id, document_number, phone,
      primary, secondary, references, district_id,
      courier_address_id, delivery_cost, is_cod, freight_collect,
      variants,
    } = this.form.value;

    const address = {
      name, identity_id, document_number, phone,
      primary, secondary, references, district_id,
    };
    const shipping = {
      courier_address_id, delivery_cost, is_cod, freight_collect,
    };
    const payload = { address, shipping, variants };

    this.loading = true;

    this._order.store(payload).pipe(
      switchMap((resp: any) => {
        const orderId = resp.data?.id;
        if (orderId == null) {
          throw new Error('La respuesta no contiene el ID del pedido generado.');
        }
        return this.router.navigate(['../', orderId], { relativeTo: this.route });
      }),
      takeUntil(this.destroy$),
      finalize(() => this.loading = false),
    ).subscribe({

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });

  }

  destroy$ = new Subject<void>();


  get completionSteps() {
    const dataComplete = ['name', 'identity_id', 'document_number', 'phone', 'primary', 'secondary', 'references', 'district_id']
      .every(name => this.form.get(name)?.valid);
    const productsComplete = this.variants.length > 0 && this.variants.valid && this.variants.controls.every(control => {
      const quantity = Number(control.get('quantity')?.value);
      const price = control.get('price')?.value;
      return Number.isInteger(quantity) && quantity > 0 && price !== null && price !== '' &&
        Number.isFinite(Number(price)) && Number(price) >= 0;
    });
    const requiresDeliveryCost = this.delivery_type === 'agency' || this.delivery_type === 'express';
    const shippingComplete = !!this.form.get('courier_address_id')?.valid &&
      (!requiresDeliveryCost || !!this.form.get('delivery_cost')?.valid);

    return [
      { label: 'Datos del cliente', completedLabel: 'Datos completados', icon: this.faUser, complete: dataComplete },
      { label: 'Productos', completedLabel: 'Productos completados', icon: this.faDolly, complete: productsComplete },
      { label: 'Informaci\u00f3n de env\u00edo', completedLabel: 'Informaci\u00f3n de env\u00edo completada', icon: this.faTruck, complete: shippingComplete },
    ];
  }

  form!: FormGroup;
  private modal?: NgbModalRef;

  faDolly = faDolly;
  faTruck = faTruck;
  faBarcode = faBarcode;
  faUser = faUser;

  constructor(
    private fb: FormBuilder,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _order: OrderService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  summary = { subTotal: 0, igv: 0, delivery: 0, total: 0 };
  private deliveryCostSubscription?: Subscription;

  ngOnInit(): void {
    this.formInit();
    this.updateSummary();
    this.deliveryCostSubscription = this.form.get('delivery_cost')!.valueChanges.subscribe(() => {
      this.updateSummary();
    });
  }

  private formInit(): void {
    this.form = this.fb.group({
      name: ['Angel Valverde', Validators.required],
      identity_id: [1, Validators.required],
      document_number: ['42412498', Validators.required],
      phone: ['943402809', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      primary: ['Urb Albino Herrera MZ H LT 16', Validators.required],
      secondary: ['1era etapa Callao'],
      references: ['Altura de la cuadra 8 de avenida pacasmayo'],
      district_id: ['70101', Validators.required],
      variants: this.fb.array([], Validators.required), // Aquí se agregarán los variants del pedido
      courier_address_id: [null, Validators.required],
      delivery_cost: ['', [Validators.required, Validators.min(0)]],
      is_cod: [null],
      freight_collect: [null],
    });

  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true, size: 'lg' });
  }
  ngOnDestroy(): void {
    this.deliveryCostSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }


  // Getter para tipar mejor
  get variants(): FormArray<FormGroup> {
    return this.form.get('variants') as FormArray<FormGroup>;
  }

  subtotal: number = 0; // Aquí se almacenará el precio total de los variants seleccionados

  //Variantes seleccionadas
  receiveVariantsTotal(total: number): void {
    this.subtotal = total;
    this.updateSummary();
  }

  private updateSummary(): void {
    const deliveryCost = Number(this.form.get('delivery_cost')?.value);
    const delivery = Number.isFinite(deliveryCost) ? deliveryCost : 0;
    this.summary = {
      ...this.summary,
      subTotal: this.subtotal,
      delivery,
      total: Math.round((this.subtotal + this.summary.igv + delivery + Number.EPSILON) * 100) / 100,
    };
  }

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
        quantity: [variant.quantity || 1, [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]],
        price: [variant.price, [Validators.required, Validators.min(0)]]
      });

      this.variants.push(group);

    });

    this.modal?.close();

  }

  is_cod: boolean = false;
  freight_collect: boolean = false;
  delivery_type: string | null = null;

  receiveCourierSelected(courier: any) {
    this.is_cod = courier?.is_cod ?? false;
    this.freight_collect = courier?.freight_collect ?? false; //pago en destino
    this.delivery_type = courier?.delivery_type ?? null;
    const deliveryCost = this.form.get('delivery_cost')!;
    if (this.delivery_type === 'agency' || this.delivery_type === 'express') {
      deliveryCost.setValidators([Validators.required, Validators.min(0)]);
    } else {
      deliveryCost.clearValidators();
      deliveryCost.setValue(0);
    }
    deliveryCost.updateValueAndValidity();
  }

}
