import { Component } from '@angular/core';
import { HeadPageComponent } from "src/app/views/shared/components/head-page/head-page.component";
import { ButtonLinkComponent } from "src/app/views/shared/components/buttons/button-link/button-link.component";
import { PurchaseHeadTableComponent } from "../../shared/purchase-head-table/purchase-head-table.component";
import { LoadingComponent } from "src/app/views/shared/components/loading/loading.component";
import { PurchaseOrderIndexComponent } from "../purchase-order-index/purchase-order-index.component";
import { environment } from 'src/app/environments/environment';
import { faCreditCard, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { PurchaseOrderService } from '../purchase_order.service';
import { PurchaseOrderHeadTableComponent } from "../shared/purchase-order-head-table/purchase-order-head-table.component";

@Component({
  selector: 'app-purchase-order-index-page',
  imports: [
    HeadPageComponent,
    ButtonLinkComponent,
    PurchaseHeadTableComponent,
    LoadingComponent,
    PurchaseOrderIndexComponent,
    PurchaseOrderHeadTableComponent
],
  templateUrl: './purchase-order-index-page.component.html',
  styleUrl: './purchase-order-index-page.component.scss'
})
export class PurchaseOrderIndexPageComponent {


  loading: boolean = true;
  // purchases: any[] = [];
  thumbnail_temp: string = environment.imageThumbnailPlaceHolderVertical;
  purchase_orders: any[] = [];
  faPlus = faPlus;
  faCreditCard = faCreditCard;

  constructor(
    private _purchase_order: PurchaseOrderService,
    private router: Router
  ) {
  }

  destroy$ = new Subject<void>();


  ngOnInit(): void {

    this._purchase_order.index().pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.purchase_orders = resp.data; //trae todas las ordenes de compra
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

  alertCreatePurchase() {

    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: 'Debe crear una compra en la produccion que esta realizando',
      confirmButtonText: 'OK',
      showConfirmButton: true
    }).then((result) => {

      if (result.isConfirmed) {
        this.router.navigate(['/batchs']);
      }

    });


  }

}
