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
import { KardexRegisterInComponent } from 'src/app/views/dashboard/kardex/kardex-register-in/kardex-register-in.component';
import { KardexRegisterOutComponent } from 'src/app/views/dashboard/kardex/kardex-register-out/kardex-register-out.component';
import { KardexRegisterReInComponent } from 'src/app/views/dashboard/kardex/kardex-register-re-in/kardex-register-re-in.component';
import { ButtonTrashComponent } from 'src/app/views/shared/components/buttons/button-trash/button-trash.component';
import { LoadingComponent } from 'src/app/views/shared/components/loading/loading.component';
import { ManufactureOrderService } from '../../order.service';

@Component({
  selector: 'app-order-reception-index',
  imports: [
    KardexIndexComponent,
    ButtonAddComponent,
    FontAwesomeModule,
    KardexRegisterInComponent,
    KardexRegisterReInComponent,
    KardexRegisterOutComponent,
    ButtonTrashComponent,
    LoadingComponent
  ],
  templateUrl: './order-reception-index.component.html',
  styleUrl: './order-reception-index.component.scss'
})
export class OrderReceptionIndexComponent {

  manufacture_id: string | null = null;

  faRightLeft = faRightLeft;
  faMinus = faMinus;

  constructor(
    private _manufactureOrder: ManufactureOrderService,
    private route: ActivatedRoute,
    private _kardex: KardexService,
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {

    // this.route.params.subscribe(params => {
    //   this.manufacture_id = params['production_id'];
    // });
    config.backdrop = 'static';
    config.keyboard = false;

    this.route.parent?.paramMap.subscribe(params => {
      this.manufacture_id = params.get('order_id');

    });

  }
  ngOnInit(): void {
    this.manufactureInit();
  }


  kardexes: any[] = [];

  manufacture: any;

  loading: boolean = false;

  kardex_summary: any;

  manufacture_variants: any[] = [];
  variants: any[] = [];

  manufactureInit() {

    this.loading = true;

    this._manufactureOrder.get(this.manufacture_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {

        this.manufacture = resp.data;

        this.kardexes = resp.data.kardexes;

        this.kardex_summary = this._kardex.calculate(this.kardexes);
        this.manufacture_variants = resp.data.manufacture_variants;
        this.variants = this.manufacture_variants.map((mv: any) => mv.variant);

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
    this.modal = this.modalService.open(content, { centered: true, size: 'xl' });
  }


}
