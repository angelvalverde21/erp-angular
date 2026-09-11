import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ButtonComponent } from '@buttons/button/button.component';
import { ButtonAddComponent } from '@buttons/button-add/button-add.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBarcode, faInbox } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';
import { VariantSearchComponent } from '../../products/variants/variant-search/variant-search.component';
import { AcquireVariantService } from '../acquire.variant.service';
import { AcquireVariantIndexRowComponent } from './acquire-variant-index-row/acquire-variant-index-row.component';
@Component({
  selector: 'app-acquire-variant-index',
  imports: [
    ButtonComponent,
    AcquireVariantIndexRowComponent,
    ButtonAddComponent,
    FontAwesomeModule,
    VariantSearchComponent
  ],
  templateUrl: './acquire-variant-index.component.html',
  styleUrl: './acquire-variant-index.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class AcquireVariantIndexComponent implements OnInit {
  
  faBarcode = faBarcode;
  faInbox = faInbox;

  @Input() acquire_variants: any = []; // ← Valor por defecto: arreglo vacío
  @Input() sum_variants: number = 0;
  @Input() acquire_id: number = 0;
  @Input() text_button: string = 'Artículos';

  @Output() emitSumAcquireVariant = new EventEmitter<number>();


  ngOnInit(): void {

  }

  modal: any;
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _acquireVariant: AcquireVariantService
  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  sumQuantity(): void {

    this.sum_variants = this.acquire_variants.reduce(
      (acc: number, mv: any) => acc + Number(mv.quantity ?? 0),
      0
    );

    this.emitSumAcquireVariant.emit(this.sum_variants);

  }

  receiveDeleteAcquireVariantId(acquire_variant_id: number) {

    this.acquire_variants = this.acquire_variants.filter((acquire_variant: any) => acquire_variant.id !== acquire_variant_id);

    this.sumQuantity();

    // this.emitSumAcquireVariant.emit(this.total);

  }

  receiveAcquireVariant(acquire_variant: any): void {

    if (!acquire_variant) return;

    this.acquire_variants = this.acquire_variants.map((mv: any) =>
      mv.id === acquire_variant.id ? acquire_variant : mv
    );

    this.sumQuantity();

    // this.emitSumAcquireVariant.emit(this.total);
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

    console.log("Received variants in acquire edit page:", variants);

    Swal.fire({
      title: 'Espere...',
      html: 'Mientras agregamos sus variantes',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    })

    this._acquireVariant.setAcquireId(this.acquire_id);

    this._acquireVariant.batch(variantsIds).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'Las variantes han sido agregadas', 'success');
        console.log(resp);
        this.acquire_variants = [...this.acquire_variants, ...resp.data];
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


