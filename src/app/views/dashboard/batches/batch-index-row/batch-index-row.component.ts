import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonLinkComponent } from '../../shared/components/buttons/button-link/button-link.component';
import { ButtonComponent } from '../../shared/components/buttons/button/button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { RouterModule } from '@angular/router';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { environment } from '../../../../core/environments/environment';
import { Subject, takeUntil } from 'rxjs';
import { BatchService } from '../batch.service';
import { LazyImgDirective } from '../../../../core/directives/lazy-img/lazy-img.directive';

@Component({
  selector: 'app-batch-index-row',
  imports: [ButtonLinkComponent, ButtonComponent, FontAwesomeModule, LoadingComponent, RouterModule, LazyImgDirective],
  templateUrl: './batch-index-row.component.html',
  styleUrl: './batch-index-row.component.scss'
})
export class BatchIndexRowComponent {

  @Input() batch: any;
  @Output() deleteBatch = new EventEmitter<number>();
  
  faTrash = faTrash;
  faEdit = faEdit;
  loadingOverlay: boolean = false;
  url_thumbnail_placeholder: string = 'https://placehold.co/400x550';

  constructor( private _batch: BatchService){
  
  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src =
      environment.imageThumbnailPlaceHolderVertical;
  }

  archivar(batch_id: number) {


    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás deshacer esta acción',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {

      if (result.isConfirmed) {

        this.loadingOverlay = true;
        
        this._batch.destroy(batch_id).pipe(takeUntil(this.destroy$)).subscribe({
          next: (resp: any) => {
            this.loadingOverlay = false;
            console.log(resp);
            this.deleteBatch.emit(batch_id);
            Swal.fire('Eliminado!', 'El elemento ha sido eliminado.', 'success');
          },
          error: (err) => {
            this.loadingOverlay = false;
            console.error(err);
            
            Swal.fire('Error', 'Ocurrió un error al eliminar el elemento.', 'error');
          }
        });

        // Acción para eliminar el elemento
        
      }
    });
  }
}
