import { Component, OnDestroy, OnInit } from '@angular/core';
// import { ShopifyOrderService } from '../shopify.order.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { CommonModule, JsonPipe } from '@angular/common';
// import { LoadingComponent } from '@shared/components/loading/loading.component.html';
import { faMagnifyingGlass, faFilter } from '@fortawesome/free-solid-svg-icons';
// import { ShopifyCardOrderIndexComponent } from "./shopify-card-order-index/shopify-card-order-index.component";
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ShopifyCardOrderIndexComponent } from '../../shared/shopify-card-order-index/shopify-card-order-index.component';
import { ShopifyOrderService } from '../../orders/shopify.order.service';
import { ReportService } from '../report.service';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';


export interface SalesReport {
  total_sales: number;
  years: {
    [year: string]: {
      total: number;
      months: {
        [month: string]: number;
      };
    };
  };
}


@Component({
  selector: 'app-report-month-all',
  imports: [
    LoadingComponent,
    JsonPipe,
    ButtonComponent,
    ShopifyCardOrderIndexComponent,
    CommonModule,
    NgbAccordionModule,
  ],
  templateUrl: './report-month-all.component.html',
  styleUrl: './report-month-all.component.scss'
})

export class ReportMonthAllComponent {


  faMagnifyingGlass = faMagnifyingGlass;
  faFilter = faFilter;
  items = ['First', 'Second', 'Third'];

  constructor(private _report: ReportService) {

  }

  loading: boolean = false;
  report: SalesReport = {
    total_sales: 0,
    years: {}
  };

  cargarOders() {

    this.loading = true;

    this._report.monthAll().pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        // Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        this.report = resp;
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });
  }

  getMonthName(monthNumber: string): string {
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const index = parseInt(monthNumber, 10) - 1;
  return monthNames[index] ?? 'Desconocido';
}

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  ngOnInit(): void {

    this.cargarOders();

  }

  get totalSales(): number {
    return Number(this.report?.total_sales || 0);
  }

}
