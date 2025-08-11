import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { BatchService } from '../batch.service';
import { BatchIndexRowComponent } from '../batch-index-row/batch-index-row.component';
import { environment } from '../../../../core/environments/environment';

@Component({
  selector: 'app-batch-index',
  imports: [LoadingComponent, BatchIndexRowComponent],
  templateUrl: './batch-index.component.html',
  styleUrl: './batch-index.component.scss'
})
export class BatchIndexComponent {

      // @Input() batches: any[] = [];

    loading: boolean = true;
    batches: any[] = [];
    thumbnail_temp: string = environment.imageThumbnailPlaceHolderVertical;
  
    faPlus = faPlus;
    
    constructor(private _batch: BatchService){
    }
  
    destroy$ = new Subject<void>();
    
    reListBatches(id: any) {
      // this.images = this.images.filter((image) => image.id !== id);/
      // console.log('Re-listing batch after deletion of ID:', id);
      this.batches = this.batches.filter((batch) => batch.id !== id);
    }
  
    ngOnInit(): void {
      
      this._batch.index().pipe(takeUntil(this.destroy$)).subscribe({
      
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
