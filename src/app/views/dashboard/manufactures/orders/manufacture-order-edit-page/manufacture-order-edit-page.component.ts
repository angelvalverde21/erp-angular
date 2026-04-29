import { Component, effect, OnInit } from '@angular/core';
import { ManufactureOrderService } from '../order.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ManufactureService } from '../../manufacture.service';
import { SummaryPurchase } from '@interfaces/summary.interface';
import { OrderWidgetComponent } from './order-widget/order-widget.component';
import { SupplierService } from '../../../users/suppliers/supplier.service';
import { Subject, switchMap, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { DateShopifyPipe } from 'src/app/views/shared/pipes/date-shopify.pipe';
import { CommonModule } from '@angular/common';
import { DateToStringPipe } from 'src/app/views/shared/pipes/date-to-string.pipe';

@Component({
  selector: 'app-manufacture-order-edit-page',
  imports: [
    LoadingComponent,
    RouterModule,
    OrderWidgetComponent,
    DateShopifyPipe,
    CommonModule,
    DateToStringPipe
  ],
  templateUrl: './manufacture-order-edit-page.component.html',
  styleUrl: './manufacture-order-edit-page.component.scss'
})

export class ManufactureOrderEditPageComponent implements OnInit {

  loading: boolean = false;
  manufacture: any = null;
  manufacture_id: number = 0;

  summary: SummaryPurchase = {
    sum_variants: 0,
    sum_purchases: 0,
    sum_kardexes: 0,
    count_variants: 0
  };

  constructor(
    private _manufactureOrder: ManufactureOrderService,
    private route: ActivatedRoute,
    private _manufacture: ManufactureService,
    private _supplier: SupplierService
  ) {

    this.route.params.subscribe(params => {
      this.manufacture_id = params['order_id'];
    });


    effect(() => {

      const event = this._manufacture.summaryEvent();

      if (!event) return;

      this.summary = {
        ...this.summary,
        ...event,
      }

      console.log('Summary actualizado manufacture-order-edit-page:', event);
      console.log(this.summary);

    });

  }
  
  ngOnInit(): void {
    this.manufactureInit();
  }

  suppliers: any[] = [];

  manufactureInit() {

    //primero iniciamos los suppliers

    this.loading = true;

    this._manufacture.get(this.manufacture_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        this.manufacture = resp.data;

        //se envia los datos por signal para que los escuchen los componentes hijos con efect
        this._manufacture.setManufacture(this.manufacture);

        this.loading = false;

        //Este valor se envia por signals
        this.summary = {
          sum_variants: this.manufacture.sum_variants,
          sum_kardexes: this.manufacture.sum_kardexes,
          sum_payments: this.manufacture.sum_payments,
          count_variants: this.manufacture.count_variants,
          count_payments: this.manufacture.count_payments,
        };



        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });
  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  formatearFecha(fecha: Date) {
    const texto = new Intl.DateTimeFormat('es-PE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(fecha);

    return texto.replace(/^./, c => c.toUpperCase());
  }

}


