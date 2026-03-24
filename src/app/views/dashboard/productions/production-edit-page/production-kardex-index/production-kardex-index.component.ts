import { Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { KardexIndexComponent } from '@dashboard/kardex/kardex-index/kardex-index.component';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { KardexService } from '@dashboard/kardex/kardex.service';
import { ButtonAddComponent } from 'src/app/views/shared/components/buttons/button-add/button-add.component';
import { faRightLeft, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { KardexRegisterInComponent } from '@dashboard/kardex/kardex-register-in/kardex-register-in.component';
import { KardexRegisterOutComponent } from '@dashboard/kardex/kardex-register-out/kardex-register-out.component';
import { KardexRegisterReInComponent } from '@dashboard/kardex/kardex-register-re-in/kardex-register-re-in.component';
import { ButtonTrashComponent } from 'src/app/views/shared/components/buttons/button-trash/button-trash.component';
import { LoadingComponent } from 'src/app/views/shared/components/loading/loading.component';
import { ProductionKardexService } from './production.kardex.service';
import { ProductionVariantService } from '../production-variant-index/production.variant.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-production-kardex-index',
  imports: [
    KardexIndexComponent,
    ButtonAddComponent,
    FontAwesomeModule,
    KardexRegisterInComponent,
    KardexRegisterReInComponent,
    KardexRegisterOutComponent,
    ButtonTrashComponent,
    LoadingComponent,
    JsonPipe
  ],
  templateUrl: './production-kardex-index.component.html',
  styleUrl: './production-kardex-index.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProductionKardexIndexComponent implements OnInit, OnDestroy {

  production_id: number = 0;

  faRightLeft = faRightLeft;
  faMinus = faMinus;

  constructor(
    private route: ActivatedRoute,
    private _kardex: KardexService,
    private _productionKardex: ProductionKardexService,
    private _productionVariant: ProductionVariantService,
    config: NgbModalConfig,
    private modalService: NgbModal,

  ) {

    // this.route.params.subscribe(params => {
    //   this.production_id = params['production_id'];
    // });
    config.backdrop = 'static';
    config.keyboard = false;

    this.route.parent?.paramMap.subscribe(params => {
      this.production_id = Number(params.get('production_id'));

    });

  }
  ngOnInit(): void {
    this.productionKardexesInit();
  }


  kardexes: any[] = [];

  production: any;

  loading: boolean = false;

  kardex_summary: any;

  production_variants: any[] = [];
  variants: any[] = [];


  productionKardexesInit() {

    this.loading = true;

    this._productionKardex.setProductionId(this.production_id);

    this._productionKardex.index().pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);

        this.kardexes = resp.data;

        console.log("Extracted variants:", this.variants);

        this.loading = false;

      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });

  }


  loadingKardex: boolean = false;

  productionVariantsInit() {

    this.loadingKardex = true;

    this._productionVariant.setProductionId(this.production_id);

    this._productionVariant.index().pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);

        const production_variants = resp.data;

        this.variants = production_variants.map((pv: any) => pv.variant);

        console.log("Extracted variants:", this.variants);
        this.loadingKardex = false;
      },
      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
        console.error(error);
      }
    });

  }


  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  receiveKardexSummary(kardex_summary: any) {

    console.log("Received kardex summary:", kardex_summary);

    this.kardex_summary = kardex_summary;

  }

  receiveKardexes(event: any) {

    this.kardexes = [...this.kardexes, ...event];

    this.kardex_summary = this._kardex.calculate(this.kardexes);
  }


  closeModal() {
    this.modal.close();
  }

  modal: any;

  openVerticallyCentered(content: TemplateRef<any>) {

    this.productionVariantsInit();

    this.modal = this.modalService.open(content, { centered: true, size: 'xl' });
  }

}

