import { Component, EventEmitter, Input, Output, TemplateRef,ViewEncapsulation, } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { RouterModule } from '@angular/router';
import { faTrash, faEdit, faCashRegister, faImages, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { PurchaseService } from '../purchase.service';
import { environment } from '../../../../core/environments/environment';
import { Subject, takeUntil } from 'rxjs';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseEditComponent } from '../purchase-edit/purchase-edit.component';
import { CapitalizePipe } from '../../shared/pipes/capitalize.pipe';
import { GalleryComponent } from '../../shared/components/gallery/gallery.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-purchase-index-row',
  imports: [
    FontAwesomeModule,
    LoadingComponent,
    RouterModule,
    PurchaseEditComponent,
    CapitalizePipe,
    GalleryComponent,
    CommonModule
  ],
  templateUrl: './purchase-index-row.component.html',
  styleUrl: './purchase-index-row.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PurchaseIndexRowComponent {
  @Input() purchase: any;
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
    private _purchase: PurchaseService
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

        this._purchase
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


  receivePurchaseUpdated(purchase : any){
    if(purchase){
      this.purchase = purchase;
    }else{
      console.log('no se actualizo el registro');
    }
    this.closeModal();
  }
}

