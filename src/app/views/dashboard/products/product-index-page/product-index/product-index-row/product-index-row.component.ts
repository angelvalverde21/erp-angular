import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ButtonLinkComponent } from 'src/app/views/dashboard/shared/components/buttons/button-link/button-link.component';
import { ButtonComponent } from 'src/app/views/dashboard/shared/components/buttons/button/button.component';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/app/core/environments/environment';
import Swal from 'sweetalert2';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProductService } from '../../../product.service';
import { Subscription } from 'rxjs';
import { LoadingComponent } from 'src/app/views/dashboard/shared/components/loading/loading.component';

@Component({
  selector: 'app-product-index-row',
  imports: [ButtonLinkComponent, ButtonComponent, FontAwesomeModule, LoadingComponent],
  templateUrl: './product-index-row.component.html',
  styleUrl: './product-index-row.component.scss',
})
export class ProductIndexRowComponent implements OnDestroy {
  @Input() product: any;
  @Output() deleteProduct = new EventEmitter<number>();
  


  faTrash = faTrash;
  faEdit = faEdit;
  loadingOverlay: boolean = false;



  constructor( private _product: ProductService){
  
  }

  subscription! : Subscription;
  
  
  ngOnDestroy(): void {
  
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src =
      environment.imageThumbnailPlaceHolderVertical;
  }

  archivar(product_id: number) {


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
        
        this.subscription = this._product.destroy(product_id).subscribe({
          next: (resp: any) => {
            this.loadingOverlay = false;
            console.log(resp);
            this.deleteProduct.emit(product_id);
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
