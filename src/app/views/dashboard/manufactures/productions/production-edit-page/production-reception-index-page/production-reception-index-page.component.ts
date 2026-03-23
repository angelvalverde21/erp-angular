import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRightLeft, faMinus } from '@fortawesome/free-solid-svg-icons';
import { ButtonAddComponent } from '@shared/components/buttons/button-add/button-add.component';
import { KardexIndexComponent } from 'src/app/views/dashboard/kardex/kardex-index/kardex-index.component';
import { KardexRegisterInComponent } from 'src/app/views/dashboard/kardex/kardex-register-in/kardex-register-in.component';
import { KardexRegisterOutComponent } from 'src/app/views/dashboard/kardex/kardex-register-out/kardex-register-out.component';
import { KardexRegisterReInComponent } from 'src/app/views/dashboard/kardex/kardex-register-re-in/kardex-register-re-in.component';
import { ButtonTrashComponent } from 'src/app/views/shared/components/buttons/button-trash/button-trash.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ManufactureProductionService } from '../../production.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-production-reception-index-page',
  imports: [
    FontAwesomeModule,
    ButtonAddComponent,
    KardexIndexComponent,
    ButtonTrashComponent,
    KardexRegisterInComponent,
    KardexRegisterOutComponent,
    KardexRegisterReInComponent
  ],
  templateUrl: './production-reception-index-page.component.html',
  styleUrl: './production-reception-index-page.component.scss'
})
export class ProductionReceptionIndexPageComponent implements OnDestroy, OnInit {

  faRightLeft = faRightLeft;
  faMinus = faMinus;

  @Input() manufacture_id: number = 0; 

  modal: any;
  constructor(
    private _manufactureProduction: ManufactureProductionService,
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }
  
  ngOnInit(): void {
    this.manufactureInit();
  }

  closeModal() {
    this.modal.close();
  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true, size: 'lg' });
  }

  manufacture_variants: any[] = [];
  variants: any[] = [];
  kardexes: any[] = []

  loading: boolean = false;

  manufactureInit() {

    this.loading = true;

    this._manufactureProduction.get(this.manufacture_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {

        console.log(resp);

        this.manufacture_variants = resp.data.manufacture_variants;

        this.variants = this.manufacture_variants.map((mv: any) => mv.variant);
        this.kardexes = resp.data.kardexes;

        // this.widget_summary = {
        //   cost: (resp.data.quantity_total > 0) ? resp.data.purchase_total / resp.data.quantity_total : 0,
        //   sum_products: resp.data.quantity_total ? resp.data.quantity_total : 0,
        //   sum_purchases: resp.data.purchase_total ? resp.data.purchase_total : 0,
        //   reception: this.kardex_summary.reception
        // };

        this.loading = false;

        // this.calculeCost();
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema guardar. Inténtalo nuevamente.', 'error');
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

