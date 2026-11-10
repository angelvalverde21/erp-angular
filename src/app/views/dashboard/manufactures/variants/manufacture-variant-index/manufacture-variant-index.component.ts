import { ManufactureVariantRowsPipe } from '../../shared/manufacture-variant-rows.pipe';
import { Component, EventEmitter, HostListener, Input, OnInit, Output, QueryList, TemplateRef, ViewChildren, ViewEncapsulation } from '@angular/core';
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
  imports: [
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

export class ManufactureVariantIndexComponent implements OnInit {
  @ViewChildren(ManufactureVariantRowComponent) rows!: QueryList<ManufactureVariantRowComponent>;
  saving = false;
  saveMessage = '';
  saveFailed = false;

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
  }

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
        this.manufacture_variants = [...this.manufacture_variants, ...resp.data];
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


