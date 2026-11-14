import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';
import { PurchaseService } from '../purchase.service';
import { SupplierService } from '../../users/suppliers/supplier.service';
import { PurchaseFormComponent } from '../purchase-form/purchase-form.component';
import { PurchaseItemIndexComponent } from '../purchase-item-index/purchase-item-index.component';
import { createDeliveryForm, DeliverySetupComponent } from '@shared/components/delivery-tracking/delivery-setup.component';
import { todayInLima } from '@shared/components/delivery-tracking/delivery-tracking.model';

@Component({
  selector: 'app-purchase-create',
  imports: [ReactiveFormsModule, CurrencyPipe, PurchaseFormComponent, PurchaseItemIndexComponent, DeliverySetupComponent],
  templateUrl: './purchase-create.component.html',
  styleUrls: ['../purchase-editor.scss', './purchase-create.component.scss'],
})
export class PurchaseCreateComponent implements OnInit, OnDestroy {
  @Input() purchaseable_type = '';
  @Input() purchaseable_id = 0;
  @Input() supplier_id: number | null = 0;
  @Input() production_stage_id: number | null = null;
  @Input() deliveryDefault = false;
  @Output() emitPurchaseCreate = new EventEmitter<any | boolean>();
  @Output() cancelled = new EventEmitter<void>();

  form!: FormGroup;
  loadingIcon = false;
  error = '';
  supplierError = '';
  suppliers: any[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private purchases: PurchaseService, private supplierService: SupplierService) {}

  ngOnInit(): void {
    const today = todayInLima();
    this.form = this.fb.group({
      purchase_start: [today], purchase_end: [today],
      purchaseable_type: [this.purchaseable_type], purchaseable_id: [this.purchaseable_id],
      observations: [''], supplier_id: [this.supplier_id || null], gateway_id: [2, Validators.required],
      ...(this.production_stage_id ? { production_stage_id: [this.production_stage_id] } : {}),
      delivery: createDeliveryForm(this.fb, this.deliveryDefault),
      purchase_items: this.fb.array([this.createPurchaseItem()], Validators.required),
    });
    this.loadSuppliers();
  }

  get purchase_items(): FormArray<FormGroup> {
    return this.form.get('purchase_items') as FormArray<FormGroup>;
  }

  get totalAmount(): number {
    return this.purchase_items.controls.reduce((sum, control) => {
      const { quantity, price } = control.getRawValue();
      return sum + Math.round(Number(quantity || 0) * Number(price || 0) * 100) / 100;
    }, 0);
  }

  private createPurchaseItem(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      quantity: [1, [Validators.required, Validators.min(0.01)]],
      unit_id: [1, Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      subtotal: [0, [Validators.required, Validators.min(0)]],
    });
  }

  addItem(): void { this.purchase_items.push(this.createPurchaseItem()); }

  create(): void {
    if (this.loadingIcon) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loadingIcon = true;
    this.error = '';
    this.purchases.store(this.form.getRawValue())
      .pipe(takeUntil(this.destroy$), finalize(() => this.loadingIcon = false)).subscribe({
        next: response => this.emitPurchaseCreate.emit(response.data),
        error: response => {
          const errors = response.error?.errors as Record<string, string[]> | undefined;
          this.error = errors ? Object.values(errors).flat().join(' ') : 'No se pudo registrar la compra. Tus datos se mantienen para reintentar.';
        },
      });
  }

  loadSuppliers(): void {
    this.supplierError = '';
    this.supplierService.index().pipe(takeUntil(this.destroy$)).subscribe({
      next: (response: any) => this.suppliers = response.data ?? [],
      error: () => this.supplierError = 'No se pudieron cargar los proveedores.',
    });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
