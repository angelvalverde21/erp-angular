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
import { PurchaseService } from '../purchase.service';
import { InputGroupComponent } from '../../shared/components/form/input-group/input-group.component';
import {
  faEdit,
  faTags,
  faPlus,
  faIdCard,
  faAddressCard,
  faImages,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../../shared/components/buttons/button/button.component';
import { UnitSelectedComponent } from '../../units/unit-selected/unit-selected.component';
import { UnitService } from '../../units/unit.service';
import { JsonPipe } from '@angular/common';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { SupplierService } from '../../suppliers/supplier.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { GalleryComponent } from '../../shared/components/gallery/gallery.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SupplierCreateComponent } from '../../suppliers/supplier-create/supplier-create.component';

@Component({
  selector: 'app-purchase-edit',
  imports: [
    ReactiveFormsModule,
    InputGroupComponent,
    ButtonComponent,
    UnitSelectedComponent,
    JsonPipe,
    LoadingComponent,
    NgSelectModule,
    GalleryComponent,
    FontAwesomeModule,
    SupplierCreateComponent
  ],
  templateUrl: './purchase-edit.component.html',
  styleUrl: './purchase-edit.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PurchaseEditComponent implements OnInit, OnDestroy {
  disabledButton: boolean = true;
  loadingIcon: boolean = false;
  form!: FormGroup;
  loading: boolean = true;
  success: boolean = false;

  faEdit = faEdit;
  faTags = faTags;
  faPlus = faPlus;
  faIdCard = faIdCard;
  faImages = faImages;
  faUser = faUser;

  faAddressCard = faAddressCard;
  units: any[] = [];

  @Input() purchase_id: number = 0;

  purchase: any;

  @Output() emitPurchaseUpdated = new EventEmitter<any | boolean>();

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private _purchase: PurchaseService,
    private _supplier: SupplierService,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  private formInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      quantity: [''],
      unit_id: [],
      price: [''],
      total: [''],
      section_id: [],
      observations: [''],
      supplier_id: [''],
    });
  }

  calculosPricetotal() {
    const round2 = (num: number) =>
      Math.round((num + Number.EPSILON) * 100) / 100;

    const priceControl = this.form.get('price');
    const totalControl = this.form.get('total');
    const quantityControl = this.form.get('quantity');

    priceControl?.valueChanges.subscribe((price) => {
      const quantity = quantityControl?.value || 0;
      const total = totalControl?.value;

      if (price != null && quantity > 0) {
        const calcTotal = round2(price * quantity);
        if (total !== calcTotal) {
          totalControl?.setValue(calcTotal, { emitEvent: false });
        }
      }
    });

    totalControl?.valueChanges.subscribe((total) => {
      const quantity = quantityControl?.value || 0;
      const price = priceControl?.value;

      if (total != null && quantity > 0) {
        const calcPrice = round2(total / quantity);
        if (price !== calcPrice) {
          priceControl?.setValue(calcPrice, { emitEvent: false });
        }
      }
    });

    quantityControl?.valueChanges.subscribe((quantity) => {
      const price = priceControl?.value || 0;
      const total = totalControl?.value || 0;

      if (price > 0) {
        const calcTotal = round2(price * quantity);
        if (total !== calcTotal) {
          totalControl?.setValue(calcTotal, { emitEvent: false });
        }
      }
    });
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

  ngOnInit(): void {
    this.formInit();
    this.calculosPricetotal();
    this.loadPurchase();
    this.getSuppliers();

    // this.form.get('section_id')?.setValue(this.section.id);

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

  loadPurchase() {
    this._purchase
      .get(this.purchase_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: any) => {
        console.log(resp.data);
        this.form.patchValue(resp.data);
        this.purchase = resp.data;
        //  console.log(this.purchase.category);
        this.loading = false;
      });
  }

  update() {
    console.log('form enviado');
    this.success = false;
    this.disabledButton = true;
    this.loadingIcon = true;
    this._purchase.update(this.purchase_id, this.form.value).subscribe({
      next: (resp: any) => {
        Swal.fire('Guardado', 'El registro ha sido actualizado', 'success');
        this.disabledButton = false;
        this.loadingIcon = false;
        this.success = true;
        this.emitPurchaseUpdated.emit(resp.data);
      },
      error: (error: any) => {
        Swal.fire(
          'Error',
          'Ocurrió un problema al actualizar. Inténtalo nuevamente.',
          'error'
        );
        this.emitPurchaseUpdated.emit(false);
        console.error(error);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  modal: any;

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true, size: 'lg' });
  }

  closeModal() {
    this.modal.close();
  }

  supplierReceiveCreate(supplier: any) {
    
    console.log(supplier);

    this.suppliers = [supplier, ...this.suppliers];

    this.form.get('supplier_id')?.setValue(supplier.id);
    // this.form.get('supplier_id')?.setValue(supplier.id);

    if (supplier) {
      this.modal.close();
    }
  }
}
