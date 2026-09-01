import { Component, OnDestroy, OnInit } from '@angular/core';
import { BatchService } from '../batch.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { BatchIndexComponent } from '../batch-index/batch-index.component';
import { LoadingComponent } from 'src/app/views/shared/components/loading/loading.component';
import { HeadPageComponent } from 'src/app/views/shared/components/head-page/head-page.component';
import { ButtonBackComponent } from 'src/app/views/shared/components/buttons/button-back/button-back.component';
import { ButtonLinkComponent } from 'src/app/views/shared/components/buttons/button-link/button-link.component';

@Component({
  selector: 'app-batch-index-page',
  imports: [
    BatchIndexComponent,
    LoadingComponent,
    HeadPageComponent,
    ButtonBackComponent,
    ButtonLinkComponent
  ],
  templateUrl: './batch-index-page.component.html',
  styleUrl: './batch-index-page.component.scss'
})
export class BatchIndexPageComponent implements OnInit, OnDestroy{


  loading: boolean = false;

  batches: any[] = [];

  constructor(
    private _batch: BatchService
  ) { }

  ngOnInit(): void {
    this.batchesInit();
  }

  batchesInit(){
    this.loading = true;
    this._batch.index().pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
        console.log(resp);
        this.batches = resp.data;
        this.loading = false;
      },
    
      error: (error: any) => {
        Swal.fire('Error','Ocurrió un problema al traer los lotes. Inténtalo nuevamente.','error');
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
