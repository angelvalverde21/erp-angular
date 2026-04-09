import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PettyCashService } from '../pettycash.service';
import { ReportService } from '../../shopify/reports/report.service';
import Swal from 'sweetalert2';
import { ButtonBackComponent } from '@shared/components/buttons/button-back/button-back.component';
import { HeadPageComponent } from '@shared/components/head-page/head-page.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { PenPipe } from '@shared/pipes/pen.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cash-income-weekly-index',
  imports: [
    ButtonBackComponent,
    HeadPageComponent,
    LoadingComponent,
    PenPipe,
    CommonModule

  ],
  templateUrl: './cash-income-weekly-index.component.html',
  styleUrl: './cash-income-weekly-index.component.scss'
})
export class CashIncomeWeeklyIndexComponent implements OnInit, OnDestroy {

  constructor(
    private _report: ReportService
  ){
  
  }

  loading: boolean = false;

  weekly: any[] = [];
  years: any[] = [];
  total: number = 0;

  ngOnInit(): void {


    this.loading = true;

    this._report.cashWeekly().pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
        console.log(resp.years);
        console.log(resp);
        this.total = resp.total_sales;
        this.years = resp.years;
        this.loading = false;
      },
    
      error: (error: any) => {
        Swal.fire('Error','Ocurrió un problema al traer los datos. Inténtalo nuevamente.','error');
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
