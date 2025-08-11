import {
  Component,
  EventEmitter,
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
import { InputGroupComponent } from '../../shared/form/input-group/input-group.component';
import {
  faEdit,
  faTags,
  faPlus,
  faIdCard,
  faAddressCard,
} from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../../shared/components/buttons/button/button.component';
import { UnitSelectedComponent } from '../../units/unit-selected/unit-selected.component';
import { UnitService } from '../../units/unit.service';
import { JsonPipe } from '@angular/common';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SupplierCreateComponent } from '../../suppliers/supplier-create/supplier-create.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SupplierService } from '../../suppliers/supplier.service';

@Component({
  selector: 'app-purchase-create',
  imports: [
    ReactiveFormsModule,
    InputGroupComponent,
    ButtonComponent,
    UnitSelectedComponent,
    JsonPipe,
    SupplierCreateComponent,
    NgSelectModule,
  ],
  templateUrl: './purchase-create.component.html',
  styleUrl: './purchase-create.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PurchaseCreateComponent {
  disabledButton: boolean = true;
  loadingIcon: boolean = false;
  form!: FormGroup;
  loading: boolean = false;
  success: boolean = false;

  faEdit = faEdit;
  faTags = faTags;
  faPlus = faPlus;
  faIdCard = faIdCard;
  faAddressCard = faAddressCard;
  units: any[] = [];

  @Output() emitPurchaseCreate = new EventEmitter<any | boolean>();

  private destroy$ = new Subject<void>();
  modal: any;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private _purchase: PurchaseService,
    private _supplier: SupplierService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  private formInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      quantity: [''],
      unit_id: [1],
      price: [''],
      total: [''],
      observations: [''],
      supplier_id: [''],
    });
  }

  calculosPricetotal() {
    
  const round2 = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

  const priceControl = this.form.get('price');
  const totalControl = this.form.get('total');
  const quantityControl = this.form.get('quantity');

  priceControl?.valueChanges.subscribe(price => {
    const quantity = quantityControl?.value || 0;
    const total = totalControl?.value;

    if (price != null && quantity > 0) {
      const calcTotal = round2(price * quantity);
      if (total !== calcTotal) {
        totalControl?.setValue(calcTotal, { emitEvent: false });
      }
    }
  });

  totalControl?.valueChanges.subscribe(total => {
    const quantity = quantityControl?.value || 0;
    const price = priceControl?.value;

    if (total != null && quantity > 0) {
      const calcPrice = round2(total / quantity);
      if (price !== calcPrice) {
        priceControl?.setValue(calcPrice, { emitEvent: false });
      }
    }
  });

  quantityControl?.valueChanges.subscribe(quantity => {
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

  ngOnInit(): void {
    this.formInit();

    this.calculosPricetotal();
    this.getSuppliers();
    // this.initUnits();
    // this.initBrands();
    // this.initsuppliers();

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
    this.loadingIcon = true;
    this.disabledButton = true;

    this.success = false;
    // console.log(this.form.value);

    this._purchase
      .store(this.form.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp: any) => {
          Swal.fire('Guardado', 'El registro ha sido creado', 'success');
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
            'Ocurrió un problema al crear. Inténtalo nuevamente.',
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

    if (supplier) {
      this.modal.close();
    }
  }
}
