import { Component, Input, OnChanges, OnDestroy, TemplateRef, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject, finalize, takeUntil } from 'rxjs';
import { VariantSearchComponent } from '../../products/variants/variant-search/variant-search.component';
import { OrderStatusStepperComponent } from '../../shopify/orders/shared/order-status-stepper/order-status-stepper.component';
import { OrderProgressStatus } from '../../shopify/orders/shared/order-status-stepper/order-status.model';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-edit',
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe, VariantSearchComponent, OrderStatusStepperComponent],
  templateUrl: './order-edit.component.html',
  styleUrl: './order-edit.component.scss'
})
export class OrderEditComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) order_id!: string;
  @Input({ required: true }) order: any;
  private readonly fb = inject(FormBuilder);
  private readonly orders = inject(OrderService);
  private readonly modals = inject(NgbModal);
  private readonly destroy$ = new Subject<void>();
  private modal?: NgbModalRef;
  saving = false;
  error = '';
  saved = false;
  form = this.fb.group({
    name: ['', Validators.required],
    identity_id: [null as number | null, Validators.required],
    document_number: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    primary: ['', Validators.required],
    secondary: [''],
    references: [''],
    district_id: [null as number | string | null, Validators.required],
    courier_address_id: [null as number | null, Validators.required],
    delivery_cost: [0, [Validators.required, Validators.min(0)]],
    is_cod: [null as boolean | null],
    freight_collect: [null as boolean | null],
    variants: this.fb.array<FormGroup>([], Validators.required),
  });

  get variants(): FormArray<FormGroup> { return this.form.controls.variants; }
  get hasProductChanges(): boolean { return this.variants.dirty; }
  get notes(): any[] { return Array.isArray(this.order?.notes) ? this.order.notes : []; }
  get receipts(): any[] { return Array.isArray(this.order?.receipts) ? this.order.receipts : []; }
  get isPickup(): boolean {
    return this.order?.courier_address?.addressable?.delivery_type == null;
  }
  get deliveryLabel(): string {
    if (this.isPickup) return 'Recojo en tienda';
    return this.order.courier_address.addressable.delivery_type === 'agency' ? 'Envío por agencia'
      : this.order.courier_address.addressable.delivery_type === 'express' ? 'Envío express' : 'Envío';
  }
  get address(): any {
    return this.order?.addresses?.find((address: any) => address.purpose === 'shipping') ?? null;
  }
  get igv(): number { return Number(this.order?.igv ?? 0); }
  get subtotal(): number {
    return this.variants.controls.reduce((sum, item) =>
      sum + Number(item.get('quantity')?.value || 0) * Number(item.get('price')?.value || 0), 0);
  }
  get total(): number {
    return Math.round((this.subtotal + this.igv + Number(this.form.controls.delivery_cost.value || 0) + Number.EPSILON) * 100) / 100;
  }
  get units(): number {
    return this.variants.controls.reduce((sum, item) => sum + Number(item.get('quantity')?.value || 0), 0);
  }
  get progress(): OrderProgressStatus {
    const status = this.order?.status;
    return status == null ? 'registrado' :
      ['registrado', 'pago_recibido', 'pago_confirmado', 'preparacion', 'enviado'].includes(status)
        ? status : 'desconocido';
  }

  ngOnChanges(): void {
    if (!this.order) return;
    this.form.reset();
    this.form.patchValue({
      ...this.address,
      courier_address_id: this.order.courier_address_id,
      delivery_cost: Number(this.order.delivery_cost ?? 0),
      is_cod: this.order.is_cod,
      freight_collect: this.order.freight_collect,
    });
    this.variants.clear();
    (this.order.variants ?? []).forEach((variant: any) => this.addVariant(variant));
    this.form.markAsPristine();
    this.saved = false;
    this.error = '';
  }

  private addVariant(variant: any): void {
    this.variants.push(this.fb.group({
      id: [variant.id],
      sku: [variant.sku],
      name: [variant.name ?? variant.product?.name ?? 'Producto'],
      variant_option_values: this.fb.control(variant.variant_option_values ?? []),
      quantity: [variant.pivot?.quantity ?? variant.quantity ?? 1,
        [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]],
      price: [variant.pivot?.price ?? variant.price, [Validators.required, Validators.min(0)]],
    }));
  }

  optionLabel(variant: FormGroup): string {
    return (variant.get('variant_option_values')?.value ?? [])
      .map((option: any) => option.option_value?.value ?? '').filter(Boolean).join(' / ');
  }

  openProducts(content: TemplateRef<unknown>): void {
    if (this.saving) return;
    this.modal = this.modals.open(content, { centered: true, size: 'lg' });
  }

  receiveVariants(variants: any[]): void {
    if (this.saving) return;
    const previousCount = this.variants.length;
    variants.forEach(variant => {
      if (!this.variants.controls.some(item => item.get('id')?.value === variant.id)) this.addVariant(variant);
    });
    if (this.variants.length !== previousCount) this.variants.markAsDirty();
    this.modal?.close();
  }

  removeVariant(index: number): void {
    if (this.saving) return;
    this.variants.removeAt(index);
    this.variants.markAsDirty();
  }

  save(): void {
    if (this.saving) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const { name, identity_id, document_number, phone, primary, secondary, references,
      district_id, courier_address_id, delivery_cost, is_cod, freight_collect, variants } = this.form.getRawValue();
    const payload = {
      address: { name, identity_id, document_number, phone, primary, secondary, references, district_id },
      shipping: { courier_address_id, delivery_cost, is_cod, freight_collect },
      variants,
    };
    this.error = '';
    this.saved = false;
    this.saving = true;
    this.form.disable({ emitEvent: false });
    this.orders.update(Number(this.order_id), payload).pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        this.saving = false;
        this.form.enable({ emitEvent: false });
      }),
    ).subscribe({
      next: () => {
        this.form.markAsPristine();
        this.saved = true;
      },
      error: () => this.error = 'No se pudieron guardar los cambios. Revisa los datos e inténtalo nuevamente.',
    });
  }

  ngOnDestroy(): void {
    this.modal?.dismiss();
    this.destroy$.next();
    this.destroy$.complete();
  }

}
