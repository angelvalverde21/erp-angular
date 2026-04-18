import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { KardexIndexComponent } from '@dashboard/kardex/kardex-index/kardex-index.component';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { KardexService } from '@dashboard/kardex/kardex.service';
import { ButtonAddComponent } from '@shared/components/buttons/button-add/button-add.component';
import { faRightLeft, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { KardexRegisterInComponent } from '@dashboard/kardex/kardex-register-in/kardex-register-in.component';
import { KardexRegisterOutComponent } from '@dashboard/kardex/kardex-register-out/kardex-register-out.component';
import { KardexRegisterReInComponent } from '@dashboard/kardex/kardex-register-re-in/kardex-register-re-in.component';
import { ButtonTrashComponent } from '@shared/components/buttons/button-trash/button-trash.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ManufactureKardexService } from '../../../manufacture.kardex.service';
import { ManufactureVariantService } from '../../../manufacture.variants.service';
import { JsonPipe } from '@angular/common';
import { ManufactureService } from '../../../manufacture.service';

@Component({
  selector: 'app-manufacture-order-kardex-index',
  imports: [
    KardexIndexComponent,
    ButtonAddComponent,
    FontAwesomeModule,
    KardexRegisterInComponent,
    KardexRegisterReInComponent,
    KardexRegisterOutComponent,
    ButtonTrashComponent,
    LoadingComponent,
    JsonPipe,
  ],
  templateUrl: './manufacture-order-kardex-index.component.html',
  styleUrl: './manufacture-order-kardex-index.component.scss'
})
export class ManufactureOrderKardexIndexComponent {

  manufacture_id: number = 0;
  manufacture_variants: any[] = [];
  faRightLeft = faRightLeft;
  faMinus = faMinus;

  constructor(
    private _manufactureKardex: ManufactureKardexService,
    private _manufactureVariant: ManufactureVariantService,
    private route: ActivatedRoute,
    private _manufacture: ManufactureService,
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
      this.manufacture_id = Number(params.get('order_id'));

    });

  }
  ngOnInit(): void {

    // this._manufactureKardex.setManufactureId(this.manufacture_id);

    // this._manufactureKardex.index().pipe(takeUntil(this.destroy$)).subscribe({

    //   next: (resp: any) => {
    //     console.log(resp);
    //     this.kardexes = resp.data;
    //     this.loading = false;
    //   },

    //   error: (error: any) => {
    //     Swal.fire('Error','Ocurrió un problema al crear. Inténtalo nuevamente.','error');
    //     console.error(error);
    //   },

    // });


    // ------------------------------------------------------------------------------- //

    this._manufactureKardex.setManufactureId(this.manufacture_id);


    this.loading = true,

      this._manufactureKardex.index().pipe(takeUntil(this.destroy$), switchMap((resp: any) => {

          console.log(resp);

          this.kardexes = resp.data;

          this._manufactureVariant.setManufactureId(this.manufacture_id);

          return this._manufactureVariant.index();

        })

      ).subscribe({

        next: (resp: any) => {

          console.log('Orders del empleado:');
          console.log(resp);
          this.manufacture_variants = resp.data;

          this.variants = this.manufacture_variants.map((mv: any) => mv.variant);

          this.loading = false;

        },

        error: (error: any) => {
          Swal.fire('Error', 'Ocurrió un problema al traer los datos del empleado.', 'error');
          console.error(error);
        },

      });

  }


  kardexes: any[] = [];

  manufacture: any;

  loading: boolean = false;

  kardex_summary: any;

  variants: any[] = [];


  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  receiveKardexSummary(kardex_summary: any) {

    console.log("Received kardex summary:", kardex_summary);

    this.kardex_summary = kardex_summary;

    this._manufacture.setSummary({
      sum_kardexes: this.kardex_summary.reception
    });

  }

  receiveKardexes(event: any) {

    this.kardexes = [...this.kardexes, ...event];

    // this.kardex_summary = this._kardex.summary(this.kardexes);

    // console.log(event);
    // console.log(this.kardex_summary);
    

    this.modal.close();
  }


  closeModal() {
    this.modal.close();
  }

  modal: any;

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true, size: 'xl' });
  }


}
