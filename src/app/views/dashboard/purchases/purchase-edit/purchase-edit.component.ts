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
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { PurchaseService } from '../purchase.service';
import { InputGroupComponent } from '../../../shared/components/form/input-group/input-group.component';
import {
  faEdit,
  faTags,
  faPlus,
  faIdCard,
  faAddressCard,
  faImages,
  faUser,
  faSave
} from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { UnitSelectedComponent } from '../../units/unit-selected/unit-selected.component';
import { UnitService } from '../../units/unit.service';
import { JsonPipe } from '@angular/common';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { SupplierService } from '../../users/suppliers/supplier.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { GalleryComponent } from '../../../shared/components/gallery/gallery.component';
import { NgbAccordionModule, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SupplierCreateComponent } from '../../users/suppliers/supplier-create/supplier-create.component';
import { PurchaseFormComponent } from '../purchase-form/purchase-form.component';
import { PurchaseItemIndexComponent } from '../purchase-item-index/purchase-item-index.component';

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
    SupplierCreateComponent,
    PurchaseFormComponent,
    PurchaseItemIndexComponent,
    NgbAccordionModule
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
  faSave = faSave;

  faAddressCard = faAddressCard;
  units: any[] = [];

  @Input() purchase_id: number = 0;
  @Input() purchaseable_type: string = '';
  @Input() purchaseable_id: number = 0;

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

    const today = new Date().toISOString().split('T')[0];

    this.form = this.fb.group({
      purchase_start: [today],
      purchase_end: [today],
      purchaseable_type: [this.purchaseable_type],
      purchaseable_id: [this.purchaseable_id],
      observations: [''],
      supplier_id: [null],
      gateway_id: [2, [Validators.required]],
      purchase_items: this.fb.array([
        this.fb.group({
          name: ['', [Validators.required]],
          quantity: ['', [Validators.required]],
          unit_id: [1, [Validators.required]],
          price: ['', [Validators.required]],
          subtotal: ['', [Validators.required]],
        })
      ])
    });
  }

  suppliers: any[] = [];


  ngOnInit(): void {
    this.formInit();
    this.purchaseInit();

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

  purchaseInit() {

    this._purchase
      .get(this.purchase_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: any) => {

        console.log(resp);
        

        const data = resp.data;

        // limpiar antes de cargar
        this.purchase_items.clear();

        // llenar items
        data.items.forEach((item: any) => {
          this.purchase_items.push(this.createPurchaseItem(item));
        });

        // setear el resto del formulario
        this.form.patchValue({
          ...data,
          purchase_items: [] // evitar conflicto con el FormArray
        });

        this.purchase = data;
        this.loading = false;
      });
      
  }

  createPurchaseItem(item?: any): FormGroup {
    return this.fb.group({
      name: [item?.name || null],
      unit_id: [item?.unit_id || null],
      quantity: [item?.quantity || 1],
      price: [item?.price || 0],
      subtotal: [item?.subtotal || 0],
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

  get purchase_items(): FormArray<FormGroup> {
    return this.form.get('purchase_items') as FormArray<FormGroup>;
  }

  addItem() {
    const item = this.fb.group({
      name: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      price: ['', [Validators.required]],
      subtotal: ['', [Validators.required]],
      unit_id: [1, [Validators.required]],
    });

    this.purchase_items.push(item);
  }


}
