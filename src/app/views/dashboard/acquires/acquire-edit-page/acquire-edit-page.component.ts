import { Component, effect, OnInit } from '@angular/core';
import { AcquireService } from '../acquire.service';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SummaryPurchase } from '@interfaces/summary.interface';
import { OrderWidgetComponent } from './order-widget/order-widget.component';
import { SupplierService } from '../../users/suppliers/supplier.service';
import { Subject, switchMap, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { DateShopifyPipe } from 'src/app/views/shared/pipes/date-shopify.pipe';
import { CommonModule } from '@angular/common';
import { DateToStringPipe } from 'src/app/views/shared/pipes/date-to-string.pipe';

@Component({
  selector: 'app-acquire-edit-page',
  imports: [
    LoadingComponent,
    RouterModule,
    OrderWidgetComponent,
    DateShopifyPipe,
    CommonModule,
    DateToStringPipe
  ],
  templateUrl: './acquire-edit-page.component.html',
  styleUrl: './acquire-edit-page.component.scss'
})

export class AcquireEditPageComponent implements OnInit {

  loading: boolean = false;
  acquire: any = null;
  acquire_id: number = 0;

  summary: SummaryPurchase = {
    sum_variants: 0,
    sum_purchases: 0,
    sum_kardexes: 0,
    count_variants: 0
  };

  constructor(
    private _acquire: AcquireService,
    private route: ActivatedRoute,
    private _supplier: SupplierService
  ) {

    this.route.params.subscribe(params => {
      
      
      this.acquire_id = params['acquire_id'];
    });


    console.log(this.acquire_id);

    effect(() => {

      const event = this._acquire.summaryEvent();

      if (!event) return;

      this.summary = {
        ...this.summary,
        ...event,
      }

      console.log('Summary actualizado acquire-edit-page:', event);
      console.log(this.summary);

    });

  }
  
  ngOnInit(): void {
    this.acquireInit();
  }

  suppliers: any[] = [];

  acquireInit() {

    //primero iniciamos los suppliers

    this.loading = true;

    this._acquire.get(this.acquire_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {

        console.log(resp);
        

        this.acquire = resp.data;

        this._acquire.setAcquire(this.acquire); //se envia los datos por signal para que los escuchen los componentes hijos con efect

        //se envia los datos por signal para que los escuchen los componentes hijos con efect

        this.loading = false;

        //Este valor se envia por signals
        this.summary = {
          created_at: this.acquire.created_at,
          sum_variants: this.acquire.sum_variants,
          sum_kardexes: this.acquire.sum_kardexes,
          sum_payments: this.acquire.sum_payments,
          count_variants: this.acquire.count_variants,
          count_payments: this.acquire.count_payments,
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


