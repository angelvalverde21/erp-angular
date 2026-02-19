import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ButtonComponent } from '@buttons/button/button.component';
import { ButtonAddComponent } from '@buttons/button-add/button-add.component';
import { ManufactureVariantRowComponent } from '../manufacture-variant-row/manufacture-variant-row.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBarcode, faInbox } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ManufactureVariantService } from '../manufactureVariant.service';
import { Subject, takeUntil } from 'rxjs';
import { VariantSearchComponent } from '../../../products/variants/variant-search/variant-search.component';

@Component({
  selector: 'app-manufacture-variant-index',
  imports: [
    ButtonComponent,
    ManufactureVariantRowComponent,
    ButtonAddComponent,
    FontAwesomeModule,
    VariantSearchComponent
  ],
  templateUrl: './manufacture-variant-index.component.html',
  styleUrl: './manufacture-variant-index.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class ManufactureVariantIndexComponent implements OnInit {


  faBarcode = faBarcode;
  faInbox = faInbox;

  @Input() manufacture_variants: any;
  @Input() sum_products: number = 0;
  @Input() manufacture_id: number = 0;
  @Input() text_button: string = 'Agregar Producto';

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

    this.sum_products = this.manufacture_variants.reduce(
      (acc: number, mv: any) => acc + Number(mv.quantity ?? 0),
      0
    );

    this.emitSumManufactureVariant.emit(this.sum_products);

  }

  receiveDeleteManufactureVariantId(manufacture_variant_id: number) {

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

    this._manufactureVariant.batch(this.manufacture_id, variants).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'Las variantes han sido agregadas', 'success');
        console.log(resp);
        this.manufacture_variants = [...this.manufacture_variants, ...resp.data];
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


