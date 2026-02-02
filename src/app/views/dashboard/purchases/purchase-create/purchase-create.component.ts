import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { InputGroupComponent } from '../../../shared/components/form/input-group/input-group.component';
import {
  faSave
} from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { UnitSelectedComponent } from '../../units/unit-selected/unit-selected.component';
import { UnitService } from '../../units/unit.service';
import { CommonModule, JsonPipe } from '@angular/common';

import { SupplierCreateComponent } from '../../users/suppliers/supplier-create/supplier-create.component';
import { SupplierService } from '../../users/suppliers/supplier.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PurchaseService } from '../purchase.service';
import { ProductSelectedComponent } from '../../products/product-selected/product-selected.component';
import { PurchaseFormComponent } from '../purchase-form/purchase-form.component';

@Component({
  selector: 'app-purchase-create',
  imports: [
    ReactiveFormsModule,
    InputGroupComponent,
    ButtonComponent,
    UnitSelectedComponent,
    JsonPipe,
    SupplierCreateComponent,
    FontAwesomeModule,
    CommonModule,
    ProductSelectedComponent,
    PurchaseFormComponent
  ],
  templateUrl: './purchase-create.component.html',
  styleUrl: './purchase-create.component.scss'
})
export class PurchaseCreateComponent {
  
  disabledButton: boolean = true;
  loadingIcon: boolean = false;
  form!: FormGroup;
  loading: boolean = false;
  success: boolean = false;
  search_result: boolean = false;

  faSave = faSave;
  units: any[] = [];

  @Output() emitPurchaseCreate = new EventEmitter<any | boolean>();
  @Input() purchaseable_type: string = "";
  @Input() purchaseable_id: number = 0;
  @Input() supplier_id: number | null = 0;

  private destroy$ = new Subject<void>();


  constructor(
    private fb: FormBuilder,
    private _purchase: PurchaseService,
    private _supplier: SupplierService
  ) {

  }


  private formInit(): void {

    const today = new Date().toISOString().split('T')[0];

    this.form = this.fb.group({
      name: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      unit_id: [1, [Validators.required]],
      price: ['', [Validators.required]],
      total: ['', [Validators.required]],
      purchase_start: [today],
      purchase_end: [today],
      purchaseable_type: [this.purchaseable_type],
      purchaseable_id: [this.purchaseable_id],
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

  hidden_fields: boolean = true;

  onSearchResult(result: any) {
    console.log(result);

    if (result.length > 0) {
      this.hidden_fields = true;
    } else {
      this.hidden_fields = false;
    }

  }


}
