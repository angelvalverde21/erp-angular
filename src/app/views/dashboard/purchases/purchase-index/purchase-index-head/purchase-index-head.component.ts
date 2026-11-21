import { RecordAttachmentsComponent } from '@shared/components/attachments/record-attachments.component';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewEncapsulation, } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { RouterModule } from '@angular/router';
import { faTrash, faEdit, faCashRegister, faImages, faPaperclip, faReceipt, faCircleArrowUp } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { PurchaseService } from '../../purchase.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ProductionStageService } from '../../../manufactures/productions/production-stages/production-stage.service';
import { NgbDropdownModule, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseEditComponent } from '../../purchase-edit/purchase-edit.component';
import { CapitalizePipe } from '@shared/pipes/capitalize.pipe';
import { GalleryComponent } from '@shared/components/gallery/gallery.component';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { DateShopifyPipe } from '@shared/pipes/date-shopify.pipe';
import { ButtonEditComponent } from '@shared/components/buttons/button-edit/button-edit.component';
import { PaymentIndexComponent } from '../../../payments/payment-index/payment-index.component';
import { PaymentService } from '../../../payments/payment.service';
import { DeliveryTrackingComponent } from '@shared/components/delivery-tracking/delivery-tracking.component';
import { DeliveryTracking } from '@shared/components/delivery-tracking/delivery-tracking.model';
import { ProductionPurchaseSection } from '../../production-purchase-section.model';

@Component({
  selector: 'app-purchase-index-head',
  imports: [
    FormsModule,
    RecordAttachmentsComponent,
    FontAwesomeModule,
    LoadingComponent,
    RouterModule,
    PurchaseEditComponent,
    CapitalizePipe,
    GalleryComponent,
    CommonModule,
    ButtonComponent,
    DateShopifyPipe,
    ButtonEditComponent,
    NgbDropdownModule,
    PaymentIndexComponent,
    DeliveryTrackingComponent
  ],
  templateUrl: './purchase-index-head.component.html',
  styleUrl: './purchase-index-head.component.scss'
})
export class PurchaseIndexHeadComponent implements OnInit{

  @Input() purchase: any;
  @Input() actionsOnly = false;
  @Input() purchaseable_type: string = "";
  @Input() purchaseable_id: number = 0;
  @Input() productionName = '';
  @Input() productionSections: readonly ProductionPurchaseSection[] = [];
  @Output() emitRemovePurchase = new EventEmitter<number>();
  @Output() emitPurchaseUpdated = new EventEmitter<any>();

  faTrash = faTrash;
  faImages = faImages;
  faEdit = faEdit;
  faPaperclip = faPaperclip;
  faCashRegister = faCashRegister;
  loadingOverlay: boolean = false;
  modal: any;
  faReceipt = faReceipt;
  faCircleArrowUp = faCircleArrowUp;
  targetSectionId: number | null = null;
  changingSection = false;
  sectionError = '';
  
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _purchase: PurchaseService,
    private _payment: PaymentService,
    private stages: ProductionStageService,
  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  payments: any[] = [];
  editorReady = false;
  attachmentsBusy = false;
  private pausedDeliveryMode: DeliveryTrackingComponent['mode'] = null;
  deliveryExpanded(editor: DeliveryTrackingComponent): boolean { return !!(editor.historyOpen || editor.mode); }
  toggleDelivery(editor: DeliveryTrackingComponent, panel: HTMLElement): void {
    if (!this.editorReady || editor.saving) return;
    if (this.deliveryExpanded(editor)) {
      this.pausedDeliveryMode = editor.mode;
      editor.mode = null;
      if (editor.historyOpen) editor.toggleHistory();
    } else {
      if (this.pausedDeliveryMode) { editor.mode = this.pausedDeliveryMode; this.pausedDeliveryMode = null; }
      else if (this.purchase.delivery_tracking) editor.toggleHistory();
      else editor.begin('create');
      panel.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
    }
  }
  purchaseLoaded(purchase: any): void {
    this.purchase = { ...this.purchase, ...purchase };
    this.editorReady = true;
  }
  deliveryUpdated(tracking: DeliveryTracking): void {
    this.purchase = { ...this.purchase, delivery_tracking: tracking };
    this.emitPurchaseUpdated.emit(this.purchase);
  }

  ngOnInit(): void {
    
    this.payments = this.purchase?.payments ?? [];
    console.log(this.payments);

  }
  // openVerticallyCentered(content: TemplateRef<any>) {
  //   this.modal = this.modalService.open(content, { centered: true, size: 'lg' });
  // }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.attachmentsBusy = false;
    this.modal?.dismiss?.();
    this.destroy$.next();
    this.destroy$.complete();
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src =
      environment.imageThumbnailPlaceHolderVertical;
  }

  loading: boolean = false;

  removePurchase(purchase_id: number) {
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

        this.loading = true;

        this._purchase
          .destroy(purchase_id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp: any) => {
              this.loading = false;
              console.log(resp);
              this.emitRemovePurchase.emit(purchase_id);
            },
            error: (err) => {
              this.loading = false;
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

  openSectionChange(content: TemplateRef<any>): void {
    this.targetSectionId = this.purchase.production_stage_id ?? null;
    this.sectionError = '';
    this.modal = this.modalService.open(content, { centered: true, beforeDismiss: () => !this.changingSection });
  }

  changeSection(): void {
    if (this.changingSection || !this.targetSectionId || this.targetSectionId === this.purchase.production_stage_id) return;
    this.changingSection = true;
    this.sectionError = '';
    this.stages.assign(this.purchaseable_id, this.targetSectionId, this.purchase.id)
      .pipe(takeUntil(this.destroy$), finalize(() => this.changingSection = false)).subscribe({
        next: response => {
          this.purchase = { ...this.purchase, ...response.data };
          this.modal.close();
          this.emitPurchaseUpdated.emit(this.purchase);
        },
        error: response => {
          const errors = response.error?.errors as Record<string, string[]> | undefined;
          this.sectionError = errors ? Object.values(errors).flat().join(' ') : 'No se pudo cambiar la sección. Intenta nuevamente.';
        },
      });
  }

  receivePurchaseUpdated(purchase: any) {
    if (!purchase) return;
    this.purchase = purchase;
    this.closeModal();
    this.emitPurchaseUpdated.emit(purchase);
  }

  attachmentsUpdated(files: readonly unknown[]): void {
    if (this.purchase.attachments_count === files.length) return;
    this.purchase = { ...this.purchase, attachments_count: files.length };
    this.emitPurchaseUpdated.emit(this.purchase);
  }
  paymentsUpdated(payments: any[]): void {
    this.payments = payments;
    this.purchase = { ...this.purchase, payments };
    this.emitPurchaseUpdated.emit(this.purchase);
  }

  openPurchaseFiles(content: TemplateRef<any>): void {
    this.attachmentsBusy = false;
    this.modal = this.modalService.open(content, { centered: true, size: 'lg', scrollable: true, beforeDismiss: () => !this.attachmentsBusy });
  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.editorReady = false;
    this.pausedDeliveryMode = null;
    this.modal = this.modalService.open(content, { centered: true, size: 'xl' });
  }

  eliminar(purchase_id: number){
    this.removePurchase(purchase_id);
  }
}
