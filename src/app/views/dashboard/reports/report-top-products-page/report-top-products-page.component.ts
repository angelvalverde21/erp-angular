import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ReportService } from '../report.service';
import { CurrencyPipe } from '@angular/common';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-report-top-products-page',
  imports: [CurrencyPipe, LoadingComponent],
  templateUrl: './report-top-products-page.component.html',
  styleUrl: './report-top-products-page.component.scss'
})
export class ReportTopProductsPageComponent implements OnInit, OnDestroy {

  products: any[] = [];
  loading: boolean = false;
  totalSales: number = 0;

  constructor(private _report: ReportService){
  
  }

  ngOnInit(): void {
    this.topInit();
  }

  topInit(){

    this.loading = true;

    this._report.topProducts().pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
        console.log(resp);
        this.products = resp.top_products;
        this.totalSales = this.products.reduce((sum, p) => sum + p.total_sales, 0);
        this.loading = false;
      },
    
      error: (error: any) => {
        Swal.fire('Error','Ocurrió un problema al obtener el top de productos','error');
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
