import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { KardexIndexComponent } from '@dashboard/kardex/kardex-index/kardex-index.component';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { KardexService } from '@dashboard/kardex/kardex.service';
import { faRightLeft, faMinus } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { KardexRegisterInComponent } from '@dashboard/kardex/kardex-register-in/kardex-register-in.component';
import { KardexRegisterOutComponent } from '@dashboard/kardex/kardex-register-out/kardex-register-out.component';
import { KardexRegisterReInComponent } from '@dashboard/kardex/kardex-register-re-in/kardex-register-re-in.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ManufactureKardexService } from '../../../manufacture.kardex.service';
import { ManufactureVariantService } from '../../../manufacture.variants.service';
import { ManufactureService } from '../../../manufacture.service';

@Component({
  selector: 'app-manufacture-order-kardex-index',
  imports: [
    KardexIndexComponent,
    KardexRegisterInComponent,
    KardexRegisterReInComponent,
    KardexRegisterOutComponent,
    LoadingComponent,
  ],
  templateUrl: './manufacture-order-kardex-index.component.html',
  styleUrl: './manufacture-order-kardex-index.component.scss',
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

    this.route.parent?.paramMap.subscribe((params) => {
      this.manufacture_id = Number(params.get('order_id'));
    });
  }

  group_kardexes: any[] = [];

  manufacture: any;

  loading: boolean = false;
  error = '';

  kardex_summary: any;

  variants: any[] = [];

  ngOnInit(): void {
    this.loadKardexes();
  }

  loadKardexes(): void {
    this.error = '';
    this.loading = true;
    this._manufactureKardex.setManufactureId(this.manufacture_id);
    this._manufactureVariant.setManufactureId(this.manufacture_id);

    this._manufactureKardex.index()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((response: any) => {
          this.group_kardexes = response.data ?? [];
          return this._manufactureVariant.index();
        }),
      )
      .subscribe({
        next: (response: any) => {
          this.manufacture_variants = response.data ?? [];
          this.variants = this.manufacture_variants.map(item => item.variant);
          this.loading = false;
        },
        error: (error: unknown) => {
          this.loading = false;
          this.error = 'No se pudieron cargar las recepciones. Intenta nuevamente.';
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
    console.log('Received kardex summary:', kardex_summary);

    this.kardex_summary = kardex_summary;

    this._manufacture.setSummary({
      // sum_kardexes: this.kardex_summary.reception
    });
  }

  receiveKardexes(event: any) {
    this.modal.close();
    this.loadKardexes();
  }

  closeModal() {
    this.modal.close();
  }

  modal: any;

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, {
      centered: true,
      size: 'xl',
    });
  }
}
