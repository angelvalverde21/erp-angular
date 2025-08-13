import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { PurchaseService } from '../purchase.service';
import { PurchaseIndexRowComponent } from '../purchase-index-row/purchase-index-row.component';
import { environment } from '../../../../core/environments/environment';
import { ButtonLinkComponent } from '../../shared/components/buttons/button-link/button-link.component';
import { PurchaseIndexComponent } from '../purchase-index/purchase-index.component';

@Component({
  selector: 'app-purchase-index-page',
  imports: [ButtonLinkComponent, PurchaseIndexComponent, LoadingComponent, PurchaseIndexRowComponent],
  templateUrl: './purchase-index-page.component.html',
  styleUrl: './purchase-index-page.component.scss'
})
export class PurchaseIndexPageComponent{
  
  loading: boolean = true;
  purchases: any[] = [];
  thumbnail_temp: string = environment.imageThumbnailPlaceHolderVertical;

  faPlus = faPlus;
  
  constructor(private _purchase: PurchaseService){
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

}
