import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { InputGroupComponent } from '../../../../shared/components/form/input-group/input-group.component';
import {
  faEdit,
  faTags,
  faPlus,
  faIdCard,
  faAddressCard,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { UnitSelectedComponent } from '../../../units/unit-selected/unit-selected.component';
import { UnitService } from '../../../units/unit.service';
import { JsonPipe } from '@angular/common';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SupplierCreateComponent } from '../../../users/suppliers/supplier-create/supplier-create.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SupplierService } from '../../../users/suppliers/supplier.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PurchaseService } from '../../purchase.service';
import { PurchaseOrderService } from '../purchase_order.service';
import { ProductSelectedComponent } from '../../../products/product-selected/product-selected.component';
import { Product } from '../../../../../interfaces/product.interface';


@Component({
  selector: 'app-purchase-order-create',
  imports: [
    ReactiveFormsModule,
    InputGroupComponent,
    ButtonComponent,
    UnitSelectedComponent,
    JsonPipe,
    SupplierCreateComponent,
    NgSelectModule,
    FontAwesomeModule,
    JsonPipe,
    ProductSelectedComponent
  ],
  templateUrl: './purchase-order-create.component.html',
  styleUrl: './purchase-order-create.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PurchaseOrderCreateComponent {
  disabledButton: boolean = true;
  loadingIcon: boolean = false;
  form!: FormGroup;
  loading: boolean = false;
  success: boolean = false;

  faEdit = faEdit;
  faTags = faTags;
  faPlus = faPlus;
  faIdCard = faIdCard;
  faUser = faUser;
  faAddressCard = faAddressCard;
  units: any[] = [];

  @Output() emitPurchaseCreate = new EventEmitter<any | boolean>();
  @Input() section: any;
  @Input() purchaseable_type: string = "";
  @Input() purchaseable_id: number = 0;

  private destroy$ = new Subject<void>();
  modal: any;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private _purchase_order: PurchaseOrderService,
    private _supplier: SupplierService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  private formInit(): void {
    const today = new Date().toISOString().split('T')[0];
    this.form = this.fb.group({
      supplier_id: ['', [Validators.required]],
      purchase_start: [today],
      purchase_end: [today],
      // observations: ['', [Validators.required]],
    });
  }

  purchase_order_items: any = [];

  ngOnInit(): void {

    this.purchase_order_items = JSON.parse(localStorage.getItem('purchase_order_items') || '[]');

    this.formInit();

    this.getSuppliers();
    // this.initUnits();
    // this.initBrands();
    // this.initsuppliers();

    this.form.get('section_id')?.setValue(this.section.id);

    this.form.statusChanges.subscribe((status) => {
      console.log(status);

      if (status === 'VALID') {
        this.disabledButton = false;
      } else {
        this.disabledButton = true;
      }
    });

    //recibir cambios del categoria
  }

  suppliers: any[] = [];

  getSuppliers() {
    this._supplier
      .index()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.suppliers = resp.data;
          this.loading = false;
          console.log(resp.data);
        },

        error: (error: any) => {
          console.error(error);
        },
      });
  }

  create() {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loadingIcon = true;
    this.disabledButton = true;

    this.success = false;
    // console.log(this.form.value);

    Swal.fire({
      title: 'Espere...',
      html: 'Generando orden de compra',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    })
    
    this._purchase_order
      .store(this.form.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp: any) => {
          Swal.fire('Guardado', 'Orden de compra creada', 'success');
          this.success = true;
          this.form.reset();
          this.disabledButton = true;
          this.loadingIcon = false;
          // Emitimos los datos creados
          this.emitPurchaseCreate.emit(resp.data);
        },
        error: (error: any) => {
          Swal.fire(
            'Error',
            'Ocurrio un problema al crear la orden de compra. Inténtalo nuevamente.',
            'error'
          );
          this.disabledButton = true;
          this.loadingIcon = false;
          // Emitimos false para indicar fallo
          this.emitPurchaseCreate.emit(false);
          console.error(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, {
      centered: true,
      size: 'lg',
    });
  }

  closeModal() {
    this.modal.close();
  }

  supplierReceiveCreate(supplier: any) {

    console.log(supplier);

    this.suppliers = [supplier, ...this.suppliers];

    this.form.get('supplier_id')?.setValue(supplier.id);
    // this.form.get('supplier_id')?.setValue(supplier.id);
    
    this.create();

    if (supplier) {
      this.modal.close();
    }

  }

  products: Product[] = [];

  receiveSearchResult(event: Product[], content: TemplateRef<any>){
    this.modal = this.modalService.open(content, {
      centered: true,
      size: 'xl',
    });

    this.products = event;
  }

  

  itemSelected(event: any){

    const purchase_order_items = JSON.parse(localStorage.getItem('purchase_order_items') || '[]');

    localStorage.setItem('purchase_order_items', JSON.stringify([...purchase_order_items, event]));

    this.purchase_order_items = [...purchase_order_items, event];

  }
}
