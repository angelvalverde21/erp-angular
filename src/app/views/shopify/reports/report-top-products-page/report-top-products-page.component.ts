import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ReportService } from '../report.service';
import { CurrencyPipe } from '@angular/common';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { faChartSimple } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-report-top-products-page',
  imports: [CurrencyPipe, LoadingComponent, FontAwesomeModule, FormsModule],
  templateUrl: './report-top-products-page.component.html',
  styleUrl: './report-top-products-page.component.scss'
})
export class ReportTopProductsPageComponent implements OnInit, OnDestroy {

  products: any[] = [];
  loading: boolean = false;
  totalSales: number = 0;
  faChartSimple = faChartSimple;
  searchTerm: string = '';

  constructor(private _report: ReportService) {

  }

  ngOnInit(): void {
    this.topInit();
  }

  get filteredProducts() {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      // Si no hay búsqueda, total general
      this.totalSales = this.products.reduce((sum, p) => sum + p.total_sales, 0);
      return this.products;
    }

    const filtered = this.products.filter(p =>
      p.title.toLowerCase().includes(term) ||
      (p.variant && p.variant.toLowerCase().includes(term))
    );

    // ✅ recalcula total filtrado
    this.totalSales = filtered.reduce((sum, p) => sum + p.total_sales, 0);

    return filtered;
  }


  topInit() {

    this.loading = true;

    this._report.topProducts().pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.products = resp.top_products;
        this.totalSales = this.products.reduce((sum, p) => sum + p.total_sales, 0);
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al obtener el top de productos', 'error');
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
