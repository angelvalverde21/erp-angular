import { Component, EventEmitter, Output } from '@angular/core';
import { VariantSearchComponent } from '../../products/variants/variant-search/variant-search.component';
import { BatchService } from './../batch.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-batch-create',
  imports: [
    VariantSearchComponent
  ],
  templateUrl: './batch-create.component.html',
  styleUrl: './batch-create.component.scss'
})
export class BatchCreateComponent {


  @Output() emitBatchCreate = new EventEmitter<any>();



  loading: boolean = false;
  batchs: any[] = [];

  constructor(
    private _batch: BatchService
  ) {

  }

  receiveSearchSelectedVariants(event: any) {

    this.loading = true;

    console.log('Variantes seleccionadas:', event);

    this._batch.batch(event).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {

        Swal.fire('Guardado', 'Lote generado correctamente', 'success');
        console.log(resp);
        this.batchs = resp.data;
        this.emitBatchCreate.emit(resp.data);
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire({
          title: "Las productos ya existen",
          icon: "warning",
          showCloseButton: true,
          focusConfirm: false,
        });
        console.error(error);
      },

    });

    // Aquí puedes manejar las variantes seleccionadas, por ejemplo, agregándolas a un formulario o a una lista.
  }


  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

}
