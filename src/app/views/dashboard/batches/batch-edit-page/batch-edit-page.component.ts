import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { BatchService } from '../batch.service';
import { HeadPageComponent } from 'src/app/views/shared/components/head-page/head-page.component';
import { ButtonBackComponent } from 'src/app/views/shared/components/buttons/button-back/button-back.component';
import { BatchEditComponent } from '../batch-edit/batch-edit.component';
import { LoadingComponent } from 'src/app/views/shared/components/loading/loading.component';
import { ButtonSaveComponent } from 'src/app/views/shared/components/buttons/button-save/button-save.component';

@Component({
  selector: 'app-batch-edit-page',
  imports: [
    HeadPageComponent,
    ButtonBackComponent,
    BatchEditComponent,
    LoadingComponent,
    ButtonSaveComponent
  ],
  templateUrl: './batch-edit-page.component.html',
  styleUrl: './batch-edit-page.component.scss'
})
export class BatchEditPageComponent implements OnInit, OnDestroy {

  batch_id: number = 0;
  batch: any = null;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private _batch: BatchService
  ) {

    this.route.params.subscribe(params => {
      this.batch_id = Number(params['batch_id']);
    });

  }

  ngOnInit(): void {

    this.batchInit();

  }

  batchInit() {

    this.loading = true;

    this._batch.get(this.batch_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        this.loading = false;
        console.log(resp);
        this.batch = resp.data;
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al traer los datos del lote, Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });
  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  receiveBatchUpdate(event: any) {

    if (event) {
      this.batchInit();
    }
  }
}
