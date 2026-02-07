import { Component, OnInit } from '@angular/core';
import { ButtonLinkComponent } from '@shared/components/buttons/button-link/button-link.component';
import { HeadPageComponent } from '@shared/components/head-page/head-page.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { UserHeadTableComponent } from '../../users/shared/user-head-table/user-head-table.component';
import { GatewayIndexComponent } from '../gateway-index/gateway-index.component';
import { Subject, takeUntil } from 'rxjs';
import { GatewayService } from '../gateway.service';

@Component({
  selector: 'app-gateway-index-page',
  imports: [
    LoadingComponent,
    ButtonLinkComponent,
    HeadPageComponent,
    UserHeadTableComponent,
    UserHeadTableComponent,
    GatewayIndexComponent,
  ],
  templateUrl: './gateway-index-page.component.html',
  styleUrl: './gateway-index-page.component.scss'
})
export class GatewayIndexPageComponent implements OnInit {


  constructor(
    private _gateway: GatewayService
  ){
  
  }

  loading: boolean = false;

  gateways: any;

  ngOnInit() {
    this.gatewaysInit();
  }

  gatewaysInit(){

    this.loading = true;

    this._gateway.index().pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
        console.log(resp);
        this.gateways = resp.data;
        this.loading = false;
      },
    
      error: (error: any) => {
        console.error(error);
        this.loading = false;
      },
    
    });
    
  }

  destroy$ = new Subject<void>();
  
  ngOnDestroy(): void {
  
    this.destroy$.next();
    this.destroy$.complete();
  
  }

  receiveSearchResult(gateways: any) {
    this.gateways = gateways;
  }

}
