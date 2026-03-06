import { AfterContentInit, AfterViewInit, Component, OnInit, viewChild } from '@angular/core';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { Router, RouterLink } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import {
  ButtonDirective,
} from '@coreui/angular';
import { Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../../dashboard/dashboard.service';

import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { PagoLinkComponent } from '../pago-link/pago-link.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUpRightFromSquare, faChartColumn, faBarcode, faChartSimple} from '@fortawesome/free-solid-svg-icons';
import { OrderLinkComponent } from '../order-link/order-link.component';
import { PurchaseOrderLinkComponent } from '../purchase-order-link/purchase-order-link.component';

@Component({
  selector: 'app-widgets-dropdown',
  templateUrl: './widgets-dropdown.component.html',
  styleUrls: ['./widgets-dropdown.component.scss'],
  imports: [
    IconDirective, 
    ButtonDirective, 
    RouterLink, 
    ChartjsComponent, 
    CommonModule,
    LoadingComponent, 
    PagoLinkComponent,
    FontAwesomeModule,
    OrderLinkComponent,
    PurchaseOrderLinkComponent
  ]
})

export class WidgetsDropdownComponent implements OnInit, AfterContentInit {

  faArrowUpRightFromSquare = faArrowUpRightFromSquare;
  faChartColumn = faChartColumn; 
  faChartSimple = faChartSimple; 

  constructor(private _dashboard: DashboardService, private router: Router) {}


  user: any;
  roles: any[] = [];

  data: any[] = [];
  options: any[] = [];

  ngOnInit(): void {
    // this.setData();
    // this.loadingDashboard();
    this.user = JSON.parse(localStorage.getItem('user') || '[]');
    this.roles = this.user.roles || [];

    console.log(this.roles);
    
  }

  destroy$ = new Subject<void>();
  
  ngOnDestroy(): void {
  
    this.destroy$.next();
    this.destroy$.complete();
  
  }

  loading: boolean = false;
  stats: any;

  loadingDashboard(){

    this.loading = true;

    this._dashboard.getDasboard().pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
        this.stats = resp.data;
        this.loading = false;
        console.log(resp);
      },
    
      error: (error: any) => {
        console.error(error);
        this.loading = false;
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      },
    
    });

  }

  ngAfterContentInit(): void {
    // this.changeDetectorRef.detectChanges();
// 
  }

}