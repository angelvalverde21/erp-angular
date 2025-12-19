import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { faCreditCard, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { PurchaseService } from '../purchase.service';
import { PurchaseIndexRowComponent } from '../purchase-index-row/purchase-index-row.component';
import { ButtonLinkComponent } from '../../../shared/components/buttons/button-link/button-link.component';
import { PurchaseIndexComponent } from '../purchase-index/purchase-index.component';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';

import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { PurchaseHeadTableComponent } from '../shared/purchase-head-table/purchase-head-table.component';
import { HeadPageComponent } from "../../../shared/components/head-page/head-page.component";


@Component({
  selector: 'app-purchase-index-page',
  imports: [
    ButtonLinkComponent, 
    PurchaseIndexComponent, 
    LoadingComponent, 
    PurchaseIndexRowComponent, 
    ButtonComponent,
    PurchaseHeadTableComponent,
    ButtonLinkComponent,
    HeadPageComponent
  ],
  templateUrl: './purchase-index-page.component.html',
  styleUrl: './purchase-index-page.component.scss'
})
export class PurchaseIndexPageComponent{
  
  loading: boolean = true;
  purchases: any[] = [];
  thumbnail_temp: string = environment.imageThumbnailPlaceHolderVertical;

  faPlus = faPlus;
  faCreditCard = faCreditCard;
  
  constructor(private _purchase: PurchaseService, private router: Router){
  }

  destroy$ = new Subject<void>();
  

  ngOnInit(): void {
    
    this._purchase.index().pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
      console.log(resp);
      this.purchases = resp.data;
      this.loading = false;
      },
    
      error: (error: any) => {
        console.error(error);
        // if (error.status === 401) {
        //   this._router.navigate(['/login']);
        // }
      },
    
    });

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  alertCreatePurchase(){

    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: 'Debe crear una compra en la produccion que esta realizando',
      confirmButtonText: 'OK',
      showConfirmButton: true
    }).then((result) => {

      if(result.isConfirmed){
        this.router.navigate(['/batchs']);
      }
      
    });
    

  }

}
