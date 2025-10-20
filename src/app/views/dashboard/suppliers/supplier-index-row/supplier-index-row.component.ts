import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonLinkComponent } from '../../../shared/components/buttons/button-link/button-link.component';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { RouterModule } from '@angular/router';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { SupplierService } from '../supplier.service';
import { environment } from '../../../../core/environments/environment';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-supplier-index-row',
  imports: [ButtonLinkComponent, ButtonComponent, FontAwesomeModule, LoadingComponent, RouterModule],

  templateUrl: './supplier-index-row.component.html',
  styleUrl: './supplier-index-row.component.scss'
})
export class SupplierIndexRowComponent {

  @Input() supplier: any;
  @Output() deleteSupplier = new EventEmitter<number>();
  
  faTrash = faTrash;
  faEdit = faEdit;
  loadingOverlay: boolean = false;

  constructor( private _supplier: SupplierService){
  
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

  archivar(supplier_id: number) {


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
        
        this._supplier.destroy(supplier_id).pipe(takeUntil(this.destroy$)).subscribe({
          next: (resp: any) => {
            this.loadingOverlay = false;
            console.log(resp);
            this.deleteSupplier.emit(supplier_id);
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
