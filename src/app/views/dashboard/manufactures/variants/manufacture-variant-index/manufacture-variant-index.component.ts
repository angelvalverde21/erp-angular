import { ManufactureVariantRowsPipe } from '../../shared/manufacture-variant-rows.pipe';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, QueryList, TemplateRef, ViewChildren, ViewEncapsulation } from '@angular/core';
import { ManufactureVariantRowComponent } from '../manufacture-variant-row/manufacture-variant-row.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBarcode, faInbox } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { concatMap, finalize, from, Subject, takeUntil, toArray } from 'rxjs';
import { VariantSearchComponent } from '../../../products/variants/variant-search/variant-search.component';
import { ManufactureVariantService } from '../../manufacture.variants.service';
import { ButtonPrintComponent } from '../../../../shared/components/buttons/button-print/button-print.component';

@Component({
  selector: 'app-manufacture-variant-index',
  host: { class: 'purchase-order-variant-editor' },
  imports: [
    CurrencyPipe, DecimalPipe,
    ManufactureVariantRowsPipe,
    ManufactureVariantRowComponent,
    FontAwesomeModule,
    VariantSearchComponent,
    ButtonPrintComponent
  ],
  templateUrl: './manufacture-variant-index.component.html',
  styleUrl: './manufacture-variant-index.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class ManufactureVariantIndexComponent implements OnInit, OnChanges {
  @ViewChildren(ManufactureVariantRowComponent) rows!: QueryList<ManufactureVariantRowComponent>;
  saving = false;
  saveMessage = '';
  saveFailed = false;

  get orderTotals(): { units: number; cost: number; products: number; variants: number; zeroCostVariants: number; valid: boolean } {
    const drafts = new Map(this.rows?.map(row => [row.manufacture_variant.id, row]) ?? []);
    const products = new Set<unknown>();
    let units = 0, cents = 0, zeroCostVariants = 0, valid = true;
    for (const item of this.manufacture_variants ?? []) {
      const row = drafts.get(item.id);
      const draft = row?.form?.getRawValue() ?? item;
      if (row?.form?.invalid) valid = false;
      const quantity = Number(draft.quantity), price = Number(draft.price);
      products.add(item.variant?.product?.id ?? item.variant?.product_id ?? item.variant?.product?.name ?? item.variant_id ?? item.id);
      if (String(draft.quantity ?? '').trim() === '' || String(draft.price ?? '').trim() === '' || !Number.isInteger(quantity) || quantity < 0 || !Number.isFinite(price) || price < 0) { valid = false; continue; }
      units += quantity;
      cents += quantity * Math.round(price * 100);
      if (quantity > 0 && price === 0) zeroCostVariants++;
    }
    valid = valid && Number.isSafeInteger(units) && Number.isSafeInteger(cents);
    return { units, cost: cents / 100, products: products.size, variants: (this.manufacture_variants ?? []).length, zeroCostVariants, valid };
  }

  get pendingRows(): ManufactureVariantRowComponent[] {
    return this.rows?.filter(row => row.hasChanges) ?? [];
  }

  get canSave(): boolean {
    return !this.saving && this.pendingRows.length > 0 &&
      !this.rows?.some(row => row.removeLoading) && this.pendingRows.every(row => row.form.valid);
  }

  onDraftChanged(): void {
    this.saveMessage = '';
    this.saveFailed = false;
    this.publishOrderTotals();
  }

  @Output() emitOrderTotals = new EventEmitter<ReturnType<ManufactureVariantIndexComponent['totalsSnapshot']>>();
  totalsSnapshot() { return { ...this.orderTotals, pending: this.pendingRows.length > 0 }; }
  private publishOrderTotals(): void { this.emitOrderTotals.emit(this.totalsSnapshot()); }
  ngOnChanges(): void { this.publishOrderTotals(); }

  saveChanges(): void {
    if (!this.canSave) return;
    const pending = this.pendingRows;
    this.saving = true;
    this.saveMessage = '';
    this.saveFailed = false;
    from(pending).pipe(
      concatMap(row => row.save()),
      toArray(),
      takeUntil(this.destroy$),
      finalize(() => { this.saving = false; }),
    ).subscribe(results => {
      const failures = results.filter(saved => !saved).length;
      this.saveFailed = failures > 0;
      this.saveMessage = failures
        ? `${failures} ${failures === 1 ? 'variante no se pudo guardar' : 'variantes no se pudieron guardar'}. Reintenta los cambios pendientes.`
        : 'Todos los cambios están guardados.';
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  warnUnsavedChanges(event: BeforeUnloadEvent): void {
    if (this.pendingRows.length || this.saving) {
      event.preventDefault();
      event.returnValue = '';
    }
  }


  faBarcode = faBarcode;
  faInbox = faInbox;

  @Input() manufacture_variants: any;
  @Input() sum_variants: number = 0;
  @Input() manufacture_id: number = 0;
  @Input() text_button: string = 'Producto';

  @Output() emitSumManufactureVariant = new EventEmitter<number>();


  ngOnInit(): void {

  }

  modal: any;
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _manufactureVariant: ManufactureVariantService
  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  sumQuantity(): void {

    this.sum_variants = this.manufacture_variants.reduce(
      (acc: number, mv: any) => acc + Number(mv.quantity ?? 0),
      0
    );

    this.emitSumManufactureVariant.emit(this.sum_variants);
    this.publishOrderTotals();

  }

  receiveDeleteManufactureVariantId(manufacture_variant_id: number) {
    this.onDraftChanged();

    this.manufacture_variants = this.manufacture_variants.filter((manufacture_variant: any) => manufacture_variant.id !== manufacture_variant_id);

    this.sumQuantity();

    // this.emitSumManufactureVariant.emit(this.total);

  }

  receiveManufactureVariant(manufacture_variant: any): void {

    if (!manufacture_variant) return;

    this.manufacture_variants = this.manufacture_variants.map((mv: any) =>
      mv.id === manufacture_variant.id ? manufacture_variant : mv
    );

    this.sumQuantity();

    // this.emitSumManufactureVariant.emit(this.total);
  }

  closeModal() {
    this.modal.close();
  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true, size: 'xl' });
  }

  loading: boolean = false;

  receiveSearchSelectedVariants(variants: any) {

    //Solo enviare los id en un array

    const variantsIds = variants.map((variant: any) => variant.id);

    this.modal.close();

    console.log("Received variants in manufacture edit page:", variants);

    Swal.fire({
      title: 'Espere...',
      html: 'Mientras agregamos sus variantes',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    })


    this._manufactureVariant.setManufactureId(this.manufacture_id);

    this._manufactureVariant.batch(variantsIds).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'Las variantes han sido agregadas', 'success');
        console.log(resp);
        const existingIds = new Set(this.manufacture_variants.map((item: any) => item.id));
        const added = resp.data.filter((item: any) => {
          if (existingIds.has(item.id)) return false;
          existingIds.add(item.id);
          return true;
        });
        this.manufacture_variants = [...this.manufacture_variants, ...added];
        this.sumQuantity();
        this.loading = false;
        this.modal.close();
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al insertar los registros. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });

  }

  destroy$ = new Subject<void>();
  
  ngOnDestroy(): void {
  
    this.destroy$.next();
    this.destroy$.complete();
  
  }

}


