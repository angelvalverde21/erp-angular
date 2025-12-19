import { Component, EventEmitter, Input, Output, TemplateRef,ViewEncapsulation, } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { RouterModule } from '@angular/router';
import { faTrash, faEdit, faCashRegister, faImages, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseEditComponent } from '../../purchase-edit/purchase-edit.component';
import { CapitalizePipe } from '../../../../shared/pipes/capitalize.pipe';
import { GalleryComponent } from '../../../../shared/components/gallery/gallery.component';
import { CommonModule } from '@angular/common';
import { environment } from 'src/app/environments/environment';
import { PurchaseOrderService } from '../purchase_order.service';

@Component({
  selector: 'app-purchase-order-index-row',
  imports: [
    FontAwesomeModule,
    LoadingComponent,
    RouterModule,
    PurchaseEditComponent,
    CapitalizePipe,
    GalleryComponent,
    CommonModule
  ],
  templateUrl: './purchase-order-index-row.component.html',
  styleUrl: './purchase-order-index-row.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PurchaseOrderIndexRowComponent {
  @Input() purchase_order: any;
  @Output() deletePurchase = new EventEmitter<number>();

  faTrash = faTrash;
  faImages = faImages;
  faEdit = faEdit;
  faPaperclip = faPaperclip;
  faCashRegister = faCashRegister;
  loadingOverlay: boolean = false;
  modal: any;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _purchase_order: PurchaseOrderService
  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }
  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true, size: 'lg' });
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

  archivar(purchase_id: number) {
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

        this._purchase_order
          .destroy(purchase_id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp: any) => {
              this.loadingOverlay = false;
              console.log(resp);
              this.deletePurchase.emit(purchase_id);
              Swal.fire(
                'Eliminado!',
                'El elemento ha sido eliminado.',
                'success'
              );
            },
            error: (err) => {
              this.loadingOverlay = false;
              console.error(err);

              Swal.fire(
                'Error',
                'Ocurrió un error al eliminar el elemento.',
                'error'
              );
            },
          });

        // Acción para eliminar el elemento
      }
    });
  }

  closeModal() {
    this.modal.close();
  }


  receivePurchaseUpdated(purchase_order : any){
    if(purchase_order){
      this.purchase_order = purchase_order;
    }else{
      console.log('no se actualizo el registro');
    }
    this.closeModal();
  }
}

