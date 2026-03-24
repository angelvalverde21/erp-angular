import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ButtonComponent } from '@buttons/button/button.component';
import { ButtonAddComponent } from '@buttons/button-add/button-add.component';
import { ProductionVariantRowComponent } from './production-variant-row/production-variant-row.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBarcode, faInbox } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ProductionVariantService } from './production.variant.service';
import { Subject, takeUntil } from 'rxjs';
import { VariantSearchComponent } from '../../../products/variants/variant-search/variant-search.component';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '@shared/components/loading/loading.component';

@Component({
  selector: 'app-production-variant-index',
  imports: [
    ButtonComponent,
    ProductionVariantRowComponent,
    ButtonAddComponent,
    FontAwesomeModule,
    VariantSearchComponent,
    LoadingComponent
  ],
  templateUrl: './production-variant-index.component.html',
  styleUrl: './production-variant-index.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class ProductionVariantIndexComponent implements OnInit {


  faBarcode = faBarcode;
  faInbox = faInbox;

  @Input() production_variants: any;
  @Input() sum_products: number = 0;
  @Input() production_id: number = 0;
  @Input() text_button: string = 'Producto';

  @Output() emitSumProductionVariant = new EventEmitter<number>();



  ngOnInit(): void {
    this.productionVariantsInit();
  }

  modal: any;
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _productionVariant: ProductionVariantService,
    private route: ActivatedRoute
  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;

    this.route.parent?.paramMap.subscribe(params => {
      this.production_id = Number(params.get('production_id'));

    });
  }


  productionVariantsInit(){

    this.loading = true;

    this._productionVariant.setProductionId(this.production_id);

    this._productionVariant.index().pipe(takeUntil(this.destroy$)).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.loading = false;
        this.production_variants = resp.data;
        this.sumQuantity();
      },
      error: (error: any) => {
        console.error('Error fetching production variants:', error);
      }
    });
  }

  sumQuantity(): void {

    this.sum_products = this.production_variants.reduce(
      (acc: number, mv: any) => acc + Number(mv.quantity ?? 0),
      0
    );

    this.emitSumProductionVariant.emit(this.sum_products);

  }

  receiveDeleteProductionVariantId(production_variant_id: number) {

    this.production_variants = this.production_variants.filter((production_variant: any) => production_variant.id !== production_variant_id);

    this.sumQuantity();

    // this.emitSumProductionVariant.emit(this.total);

  }

  receiveProductionVariant(production_variant: any): void {

    if (!production_variant) return;

    this.production_variants = this.production_variants.map((pv: any) =>
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

    this._productionVariant.setProductionId(this.production_id);

    this._productionVariant.batch(variantsIds).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'Las variantes han sido agregadas', 'success');
        console.log(resp);
        this.production_variants = [...this.production_variants, ...resp.data];
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


