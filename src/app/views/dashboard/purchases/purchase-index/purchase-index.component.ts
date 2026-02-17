import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { PurchaseIndexRowComponent } from '../purchase-index-row/purchase-index-row.component';
import { CapitalizePipe } from '@shared/pipes/capitalize.pipe';
import { faEdit, faCashRegister, faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { PurchaseEditComponent } from '../purchase-edit/purchase-edit.component';
import { GalleryComponent } from '@shared/components/gallery/gallery.component';
import { CurrencyPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonAddComponent } from '@buttons/button-add/button-add.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseCreateComponent } from '../purchase-create/purchase-create.component';

@Component({
  selector: 'app-purchase-index',
  imports: [
    LoadingComponent,
    PurchaseIndexRowComponent,
    CapitalizePipe,
    ButtonComponent,
    PurchaseEditComponent,
    GalleryComponent,
    CurrencyPipe,
    FontAwesomeModule,
    ButtonAddComponent,
    PurchaseCreateComponent
  ],
  templateUrl: './purchase-index.component.html',
  styleUrl: './purchase-index.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PurchaseIndexComponent implements OnInit, OnDestroy {

  @Input() purchases: any[] = [];
  @Input() purchaseable_type: string = '';
  @Input() purchaseable_id: number = 0;
  @Input() sum_purchases: number = 0;
  //

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  @Output() emitSumPurchaseIndex = new EventEmitter<number>();

  faEdit = faEdit;
  faCashRegister = faCashRegister;
  faBagShopping = faBagShopping;

  reListPurchases(id: any) {
    this.purchases = this.purchases.filter((purchase) => purchase.id !== id);
    // console.log('Purchase with ID', id, 'has been removed. Updated purchases:', this.purchases);

  }

  modal: any

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true, size: 'xl' });
  }

  purchase: any = null;

  sumTotalAmount() {

    this.sum_purchases = this.purchases.reduce(
      (sum, purchase) => sum + Number(purchase.total ?? 0),
      0
    );

    this.emitSumPurchaseIndex.emit(this.sum_purchases);

    // return sum;
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  receivePurchaseUpdated(PurchaseUpdated: any) {

    const index = this.purchases.findIndex(p => p.id === PurchaseUpdated.id);
    if (index !== -1) {
      this.purchases[index] = PurchaseUpdated;
    }
    // console.log('Updated Purchase:', PurchaseUpdated);

    this.sumTotalAmount();
    // this.emitSumPurchaseIndex.emit(this.sum_purchases);

  }

  receiveRemovePurchase(purchase_id: number) {

    // console.log('Removing Purchase with ID:', purchase_id);

    this.purchases = this.purchases.filter(p => p.id !== purchase_id);
    this.sumTotalAmount();
    // this.emitSumPurchaseIndex.emit(this.sum_purchases);
  }

  receivePurchaseCreate(purchase: any) {

    this.purchases = [purchase, ...this.purchases];
    this.modal.close();
    this.sumTotalAmount();

  }

  closeModal() {
    this.modal.close();
  }


}