import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { AttributeService } from '../attribute.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-attribute-row',
  imports: [],
  templateUrl: './attribute-row.component.html',
  styleUrl: './attribute-row.component.scss'
})
export class AttributeRowComponent implements OnDestroy {

  @Input() attribute: any;
  @Output() emitAttributeDelete = new EventEmitter<any>();


  loading: boolean = false;

  constructor(
    private _attribute: AttributeService
  ) {

  }

  deleteAttribute(attribute_id: number) {

    this.loading = true;

    this._attribute.destroy(attribute_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'El registro ha sido eliminado', 'success');
        console.log(resp);
        this.loading = false;
        this.emitAttributeDelete.emit(this.attribute);
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al eliminar. Inténtalo nuevamente.', 'error');
        console.error(error);
        this.emitAttributeDelete.emit(false);
      },

    });

  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

}
