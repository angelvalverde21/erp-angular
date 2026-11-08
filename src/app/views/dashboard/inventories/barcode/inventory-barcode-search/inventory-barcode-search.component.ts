import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BaseService } from 'src/app/views/base.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBarcode } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { finalize, Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from 'src/app/views/shared/components/loading/loading.component';
import { BarcodeIndexComponent } from '../../../barcodes/barcode-index/barcode-index.component';
import { VariantService } from '../../../products/variants/variant.service';
import { ProductService } from '../../../products/product.service';
import { KardexIndexComponent } from '../../../kardex/kardex-index/kardex-index.component';
import { BarcodeSearchResponse, BarcodeVariant, KardexMovement } from './inventory-barcode.model';

@Component({
  selector: 'app-inventory-barcode-search',
  imports: [ReactiveFormsModule, FontAwesomeModule, LoadingComponent, CurrencyPipe, DatePipe, UpperCasePipe,
    BarcodeIndexComponent, KardexIndexComponent, RouterLink],
  templateUrl: './inventory-barcode-search.component.html',
  styleUrl: './inventory-barcode-search.component.scss',
})
export class InventoryBarcodeSearchComponent implements OnInit, OnDestroy {
  @Input() barcode = '';
  readonly faBarcode = faBarcode;
  private readonly destroy$ = new Subject<void>();
  private readonly cancelImageRequest$ = new Subject<void>();
  private modal?: NgbModalRef;

  form!: FormGroup;
  loading = false;
  updatingStock = false;
  hasSearched = false;
  searchedBarcode = '';
  error = '';
  stockError = '';
  stockSaved = false;
  stockNeedsReview = false;
  imageUnavailable = false;
  variant: BarcodeVariant | null = null;
  variants: BarcodeVariant[] = [];

  readonly stockControl = new FormControl<number | null>(null, [
    Validators.required, Validators.min(0), Validators.pattern(/^\d+$/),
  ]);
  readonly changeControl = new FormControl<number | null>(0, [Validators.required, Validators.pattern(/^-?\d+$/)]);
  readonly reasonControl = new FormControl('', { nonNullable: true, validators: [Validators.maxLength(500)] });
  readonly stockForm = new FormGroup({ stock: this.stockControl, change: this.changeControl, reason: this.reasonControl });

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private _variant: VariantService,
    private _base: BaseService,
    private _product: ProductService,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  get canSearch(): boolean {
    return !this.loading && !this.updatingStock &&
      !!String(this.form?.get('barcode')?.value ?? '').trim();
  }

  get productEditLink(): (string | number)[] | null {
    const productId = this.variant?.product?.id ?? this.variant?.product_id;
    const store = this._base.store;

    return productId && store ? ['/', store, 'dashboard', 'products', productId] : null;
  }

  get productImageUrl(): string | null {
    if (this.imageUnavailable) return null;

    const image = this.variant?.product?.image;
    return image?.url_thumbnail || image?.url_medium || image?.url_large || null;
  }
  get validStock(): boolean {
    return Number.isSafeInteger(this.stockControl.value) && this.stockControl.value! >= 0;
  }
  get stockDifference(): number | null {
    if (!this.validStock || this.variant?.stock == null || !Number.isSafeInteger(this.variant.stock)) return null;
    return this.stockControl.value! - this.variant.stock;
  }
  get resultingStock(): number | null { return this.stockControl.value; }
  get hasStockChange(): boolean { return this.stockDifference !== null && this.stockDifference !== 0; }
  get kardexes() {
    if (!this.variant) return [];
    const { kardexes, ...variant } = this.variant;
    return (kardexes ?? []).map(kardex => ({ ...kardex, variant: kardex.variant ?? variant }));
  }
  get canUpdateStock(): boolean {
    return !!this.variant && !this.loading && !this.updatingStock && !this.stockNeedsReview &&
      this.stockForm.valid && this.validStock && Number.isSafeInteger(this.changeControl.value) &&
      this.stockDifference != null && this.stockDifference !== 0;
  }
  get operationComplete(): boolean { return this.stockSaved && this.stockForm.pristine; }
  get operationSummary(): string {
    if (this.operationComplete || this.stockDifference == null) return '';
    const difference = this.stockDifference;
    if (!difference) return 'Ingresa las unidades a agregar o escribe directamente el total contado.';
    const quantity = Math.abs(difference);
    const action = difference > 0 ? quantity === 1 ? 'Se agregará' : 'Se agregarán'
      : quantity === 1 ? 'Se retirará' : 'Se retirarán';
    return action + ' ' + quantity + ' ' + (quantity === 1 ? 'unidad' : 'unidades') + ' de este producto.';
  }

  ngOnInit(): void {
    this.form = this.fb.group({ barcode: [this.barcode] });
    this.changeControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(change => {
      if (!this.variant) return;
      const base = this.variant.stock;
      if (base === 0 && change != null && change < 0) {
        change = 0;
        this.changeControl.setValue(0, { emitEvent: false });
      }
      const total = base != null && Number.isSafeInteger(base) && Number.isSafeInteger(change) ? base + change! : null;
      this.stockControl.setValue(total != null && Number.isSafeInteger(total) ? total : null, { emitEvent: false });
      this.stockControl.markAsDirty();
    });
    this.stockControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(total => {
      if (!this.variant) return;
      const base = this.variant.stock;
      if (base === 0 && total != null && total < 0) {
        total = 0;
        this.stockControl.setValue(0, { emitEvent: false });
      }
      const change = base != null && Number.isSafeInteger(base) && Number.isSafeInteger(total) ? total! - base : null;
      this.changeControl.setValue(change != null && Number.isSafeInteger(change) ? change : null, { emitEvent: false });
      this.changeControl.markAsDirty();
    });
  }

  private resetStockFields(): void {
    this.stockForm.reset({ stock: this.variant?.stock ?? null, change: 0, reason: '' }, { emitEvent: false });
  }

  blockNegativeValue(event: KeyboardEvent): void {
    if (this.variant?.stock === 0 && event.key === '-') event.preventDefault();
  }

  search(): void {
    if (!this.canSearch) return;
    this.cancelImageRequest$.next();
    this.imageUnavailable = false;
    this.searchedBarcode = String(this.form.get('barcode')!.value).trim();
    this.hasSearched = true;
    this.error = '';
    this.variant = null;
    this.variants = [];
    this.resetStockFields();
    this.stockError = '';
    this.stockSaved = false;
    this.stockNeedsReview = false;
    this.loading = true;

    this._variant.get(this.searchedBarcode).pipe(
      takeUntil(this.destroy$), finalize(() => this.loading = false),
    ).subscribe({
      next: (response: BarcodeSearchResponse) => {
        const variant = response && 'data' in response ? response.data : response;
        this.variant = variant?.id != null ? variant : null;
        this.variants = this.variant ? [this.variant] : [];
        this.resetStockFields();
        this.loadProductImage();
      },
      error: (error: { status?: number }) => {
        if (error.status !== 404) this.error = 'No se pudo consultar el inventario. Intenta nuevamente.';
      },
    });
  }

  private loadProductImage(): void {
    const variantId = this.variant?.id;
    const productId = this.variant?.product?.id ?? this.variant?.product_id;
    if (!variantId || !productId || this.productImageUrl) return;

    this._product.get(productId)
      .pipe(
        takeUntil(this.destroy$),
        takeUntil(this.cancelImageRequest$),
      )
      .subscribe({
        next: (response) => {
          if (!this.variant || this.variant.id !== variantId || this.productImageUrl) return;

          const product = response?.data ?? response;
          const image = product?.image;
          if (!image?.url_thumbnail && !image?.url_medium && !image?.url_large) return;

          this.variant = {
            ...this.variant,
            product: {
              ...this.variant.product,
              id: productId,
              name: this.variant.product?.name || product.name || 'Producto',
              image,
            },
          };
          this.variants = [this.variant];
        },
        error: () => {
          // La imagen es opcional; el stock sigue disponible si esta consulta falla.
        },
      });
  }

  updateStock(): void {
    this.stockForm.markAllAsTouched();

    const variant = this.variant;
    const stock = this.stockControl.value;
    const difference = this.stockDifference;

    if (!variant || !this.canUpdateStock || stock === null || difference === null) return;

    const movement = this.buildStockMovement(variant.id, difference);

    this.stockError = '';
    this.stockSaved = false;
    this.setStockUpdating(true);

    this._variant.update(variant.id, movement)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.setStockUpdating(false)),
      )
      .subscribe({
        next: (response: BarcodeSearchResponse) => {
          console.log('Respuesta del servidor al actualizar stock:', response);
          this.applyStockUpdate(response, { ...variant, stock });
        },
        error: () => this.handleStockUpdateError(),
      });
  }

  private buildStockMovement(variantId: number, difference: number): KardexMovement {
    return {
      variant_id: variantId,
      direction: difference > 0 ? 'in' : 'out',
      quantity: Math.abs(difference),
      comment: this.reasonControl.value.trim() || 'Conteo parcial',
    };
  }

  private setStockUpdating(updating: boolean): void {
    this.updatingStock = updating;

    if (updating) {
      this.stockForm.disable({ emitEvent: false });
    } else {
      this.stockForm.enable({ emitEvent: false });
    }
  }

  private applyStockUpdate(response: BarcodeSearchResponse, fallback: BarcodeVariant): void {
    const updatedVariant = response && 'data' in response ? response.data : response;
    const product = updatedVariant?.product ?? this.variant?.product ?? fallback.product;
    const image = product?.image ?? this.variant?.product?.image;

    this.variant = { ...fallback, ...updatedVariant, product: product ? { ...product, image } : undefined };
    this.variants = [this.variant];
    this.resetStockFields();
    this.stockSaved = true;
  }

  private handleStockUpdateError(): void {
    this.stockNeedsReview = true;
    this.stockError = 'No se pudo confirmar el movimiento. Consulta de nuevo el producto para revisar el stock antes de registrar otro ajuste.';
  }

  openVerticallyCentered(content: TemplateRef<unknown>): void {
    this.modal = this.modalService.open(content, { centered: true, size: 'xl' });
  }
  receivePrintStatus(status: boolean): void { if (status) this.closeModal(); }
  closeModal(): void { this.modal?.close(); }
  ngOnDestroy(): void {
    this.modal?.dismiss();
    this.destroy$.next();
    this.destroy$.complete();
    this.cancelImageRequest$.complete();
  }
}
