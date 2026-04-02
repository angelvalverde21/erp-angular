import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ButtonComponent } from '@buttons/button/button.component';
import { ButtonAddComponent } from '@buttons/button-add/button-add.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBarcode, faInbox } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';
import { VariantSearchComponent } from '../../../../products/variants/variant-search/variant-search.component';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ManufactureProductionVariantIndexRowComponent } from './manufacture-production-variant-index-row/manufacture-production-variant-index-row.component';
import { ManufactureService } from '../../../manufacture.service';
import { ManufactureVariantService } from '../../../manufacture.variants.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-manufacture-production-variant-index',
  imports: [
    ButtonComponent,
    ManufactureProductionVariantIndexRowComponent,
    ButtonAddComponent,
    FontAwesomeModule,
    VariantSearchComponent,
    LoadingComponent,
    JsonPipe
  ],
  templateUrl: './manufacture-production-variant-index.component.html',
  styleUrl: './manufacture-production-variant-index.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class ManufactureProductionVariantIndexComponent implements OnInit {
  faBarcode = faBarcode;
  faInbox = faInbox;

  @Input() manufacture_variants: any;
  @Input() sum_variants: number = 0;
  @Input() manufacture_id: number = 0;
  @Input() text_button: string = 'Producto';

  @Output() emitSumProductionVariant = new EventEmitter<number>();



  ngOnInit(): void {
    this.productionVariantsInit();
  }

  modal: any;
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _manufacture: ManufactureService,
    private _manufactureVariant: ManufactureVariantService,
    private route: ActivatedRoute
  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;

    this.route.parent?.paramMap.subscribe(params => {
      this.manufacture_id = Number(params.get('production_id'));

    });
  }


  productionVariantsInit() {

    this.loading = true;

    this._manufactureVariant.setManufactureId(this.manufacture_id);

    this._manufactureVariant.index().pipe(takeUntil(this.destroy$)).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.loading = false;
        this.manufacture_variants = resp.data;
        this.sumQuantity();
      },
      error: (error: any) => {
        console.error('Error fetching production variants:', error);
      }
    });
  }

  sumQuantity(): void {

    this.sum_variants = this.manufacture_variants.reduce(
      (acc: number, mv: any) => acc + Number(mv.quantity ?? 0),
      0
    );

    // this.emitSumProductionVariant.emit(this.sum_products);

    //Este valor se envia por signals
    this._manufacture.setSummary({
      sum_variants: this.sum_variants,
      count_variants: this.manufacture_variants.length
    });

  }

  receiveDeleteProductionVariantId(production_variant_id: number) {

    this.manufacture_variants = this.manufacture_variants.filter((production_variant: any) => production_variant.id !== production_variant_id);

    this.sumQuantity();

    // this.emitSumProductionVariant.emit(this.total);

  }

  receiveProductionVariant(production_variant: any): void {

    if (!production_variant) return;

    this.manufacture_variants = this.manufacture_variants.map((pv: any) =>
      pv.id === production_variant.id ? production_variant : pv
    );

    this.sumQuantity();
    // this.emitSumProductionVariant.emit(this.total);
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

    console.log("Received variants in production edit page:", variants);

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


