import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ReportService } from '../report.service';
import { CurrencyPipe } from '@angular/common';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { faChartSimple } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ShopifyImageThumbnailPipe } from '../../../../shared/pipes/shopify/shopify-image-thumbnail.pipe';
import { ShopifyImageLargePipe } from '../../../../shared/pipes/shopify/shopify-image-large.pipe';
import { Fancybox } from '@fancyapps/ui';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-report-top-products-between-page',
  imports: [
    CurrencyPipe,
    LoadingComponent,
    FontAwesomeModule,
    FormsModule,
    ShopifyImageThumbnailPipe,
    ShopifyImageLargePipe
  ],
  templateUrl: './report-top-products-between-page.component.html',
  styleUrl: './report-top-products-between-page.component.scss'
})
export class ReportTopProductsBetweenPageComponent implements OnInit, OnDestroy {

  products: any[] = [];
  loading: boolean = false;
  totalSales: number = 0;
  faChartSimple = faChartSimple;
  searchTerm: string = '';
  day_start: string = '';
  day_end: string = ''

  constructor(
    private _report: ReportService,
    private elRef: ElementRef,
    private route: ActivatedRoute
  ) {

    this.route.params.subscribe(params => {
      this.day_start = params['start'];
      this.day_end = params['end'];

      console.log(params);
      

    });



  }

  ngOnInit(): void {
    this.topInit();
    Fancybox.bind(this.elRef.nativeElement, '[data-fancybox]', {
      // Custom options
    })
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

    Swal.fire({
      title: 'Espere...',
      html: 'Generando su reporte',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    })


    this._report.topProductsBetween(this.day_start, this.day_end).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.products = resp;
        this.totalSales = this.products.reduce((sum, p) => sum + p.total_sales, 0);
        this.loading = false;
        Swal.close();
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

    Fancybox.unbind(this.elRef.nativeElement);
    Fancybox.close();


  }



}
