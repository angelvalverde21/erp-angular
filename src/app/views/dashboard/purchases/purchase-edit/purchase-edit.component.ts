import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';
import { PurchaseService } from '../purchase.service';
import { SupplierService } from '../../users/suppliers/supplier.service';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { PurchaseFormComponent } from '../purchase-form/purchase-form.component';
import { PurchaseItemIndexComponent } from '../purchase-item-index/purchase-item-index.component';

interface PurchaseItemDraft {
  name?: string;
  unit_id?: number | null;
  quantity?: number | string;
  price?: number | string;
  subtotal?: number | string;
}

@Component({
  selector: 'app-purchase-edit',
  imports: [ReactiveFormsModule, CurrencyPipe, LoadingComponent, PurchaseFormComponent, PurchaseItemIndexComponent],
  templateUrl: './purchase-edit.component.html',
  styleUrls: ['../purchase-editor.scss', './purchase-edit.component.scss'],
})
export class PurchaseEditComponent implements OnInit, OnDestroy {
  @Input() purchase_id = 0;
  @Input() purchaseable_type = '';
  @Input() purchaseable_id = 0;
  @Output() emitPurchaseUpdated = new EventEmitter<unknown>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() purchaseLoaded = new EventEmitter<any>();

  form!: FormGroup;
  loading = true;
  loadingIcon = false;
  error = '';
  supplierError = '';
  suppliers: unknown[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private purchases: PurchaseService, private supplierService: SupplierService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      purchase_start: [null], purchase_end: [null],
      purchaseable_type: [this.purchaseable_type], purchaseable_id: [this.purchaseable_id],
      observations: [''], supplier_id: [null],
      purchase_items: this.fb.array([], Validators.required),
    });
    this.loadSuppliers();
    this.purchaseInit();
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

  purchaseInit(): void {
    this.loading = true;
    this.error = '';
    this.purchases.get(this.purchase_id).pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
      next: response => {
        const { items, ...data } = response.data;
        this.purchase_items.clear();
        (items ?? []).forEach((item: PurchaseItemDraft) => this.purchase_items.push(this.createPurchaseItem(item)));
        this.form.patchValue(data);
        this.form.markAsPristine();
        this.purchaseLoaded.emit(response.data);
      },
      error: () => this.error = 'No se pudo cargar la compra. Intenta nuevamente.',
    });
  }

  createPurchaseItem(item: PurchaseItemDraft = {}): FormGroup {
    return this.fb.group({
      name: [item.name ?? '', [Validators.required, Validators.maxLength(255)]],
      unit_id: [item.unit_id ?? 1, Validators.required],
      quantity: [item.quantity ?? 1, [Validators.required, Validators.min(0.01)]],
      price: [item.price ?? 0, [Validators.required, Validators.min(0)]],
      subtotal: [item.subtotal ?? 0, [Validators.required, Validators.min(0)]],
    });
  }

  addItem(): void { this.purchase_items.push(this.createPurchaseItem()); }

  update(): void {
    if (this.loadingIcon) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loadingIcon = true;
    this.error = '';
    this.purchases.update(this.purchase_id, this.form.getRawValue())
      .pipe(takeUntil(this.destroy$), finalize(() => this.loadingIcon = false)).subscribe({
        next: response => {
          this.form.markAsPristine();
          this.emitPurchaseUpdated.emit(response.data);
        },
        error: response => {
          const errors = response.error?.errors as Record<string, string[]> | undefined;
          this.error = errors ? Object.values(errors).flat().join(' ') : 'No se pudieron guardar los cambios. Tus datos se mantienen para reintentar.';
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
