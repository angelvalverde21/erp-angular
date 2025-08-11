import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { PurchaseService } from '../purchase.service';
import { PurchaseIndexRowComponent } from '../purchase-index-row/purchase-index-row.component';
import { environment } from '../../../../core/environments/environment';

@Component({
  selector: 'app-purchase-index',
  imports: [LoadingComponent, PurchaseIndexRowComponent],
  templateUrl: './purchase-index.component.html',
  styleUrl: './purchase-index.component.scss'
})
export class PurchaseIndexComponent implements OnInit, OnDestroy{

    // @Input() purchases: any[] = [];

  
  loading: boolean = true;
  purchases: any[] = [];
  thumbnail_temp: string = environment.imageThumbnailPlaceHolderVertical;

  faPlus = faPlus;
  
  constructor(private _purchase: PurchaseService){
  }

  destroy$ = new Subject<void>();
  
  reListPurchases(id: any) {
    // this.images = this.images.filter((image) => image.id !== id);/
    // console.log('Re-listing purchase after deletion of ID:', id);
    this.purchases = this.purchases.filter((purchase) => purchase.id !== id);
  }

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
