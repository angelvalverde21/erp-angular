import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { BatcheService } from '../batche.service';
import { BatcheIndexRowComponent } from '../batche-index-row/batche-index-row.component';
import { environment } from '../../../../core/environments/environment';

@Component({
  selector: 'app-batche-index',
  imports: [LoadingComponent, BatcheIndexRowComponent],
  templateUrl: './batche-index.component.html',
  styleUrl: './batche-index.component.scss'
})
export class BatcheIndexComponent {

  
      // @Input() batches: any[] = [];
  
    
    loading: boolean = true;
    batches: any[] = [];
    thumbnail_temp: string = environment.imageThumbnailPlaceHolderVertical;
  
    faPlus = faPlus;
    
    constructor(private _batche: BatcheService){
    }
  
    destroy$ = new Subject<void>();
    
    reListBatches(id: any) {
      // this.images = this.images.filter((image) => image.id !== id);/
      // console.log('Re-listing batche after deletion of ID:', id);
      this.batches = this.batches.filter((batche) => batche.id !== id);
    }
  
    ngOnInit(): void {
      
      this._batche.index().pipe(takeUntil(this.destroy$)).subscribe({
      
        next: (resp: any) => {
        console.log(resp);
        this.batches = resp.data;
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
