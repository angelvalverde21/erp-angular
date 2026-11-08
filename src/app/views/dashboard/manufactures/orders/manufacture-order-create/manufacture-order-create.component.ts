import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ManufactureOrderService } from '../manufacture.order.service';
import { SupplierService } from '@dashboard/users/suppliers/supplier.service';
import { ManufactureOrderFormComponent } from '../manufacture-order-form/manufacture-order-form.component';

@Component({
  selector: 'app-manufacture-order-create',
  imports: [
    ReactiveFormsModule,
    LoadingComponent,
    ManufactureOrderFormComponent
  ],
  templateUrl: './manufacture-order-create.component.html',
  styleUrl: './manufacture-order-create.component.scss'
})
export class ManufactureOrderCreateComponent implements OnInit, OnDestroy {

  form!: FormGroup;

  @Output() emitCreateManufacture = new EventEmitter<any>();

  loading: boolean = false;
  disabledButton: boolean = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private _manufactureOrder: ManufactureOrderService,
    private _supplier: SupplierService
  ) {

  }

  formInit() {

    const today = new Date().toISOString().split('T')[0];

    this.form = this.fb.group({
      name: ['', Validators.required], //Nombre del proyecto, no del producto
      supplier_id: [null],
      manufacture_start: [today],
      manufacture_end: [today],
      // quantity_total: ['', Validators.required],
    });
  }

  destroy$ = new Subject<void>();

  manufacture: any;

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  ngOnInit(): void {
    this.suppliersInit();
    this.formInit();
  }

  createManufacture() {

    if (this.disabledButton) return;

    console.log(this.form.value);


    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = false;
    this.disabledButton = true;

    Swal.fire({
      title: 'Espere...',
      html: 'Guardando el registro',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    })

    this._manufactureOrder.store(this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        this.manufacture = resp.data;
        this.loading = false;
        this.disabledButton = false;
        this.emitCreateManufacture.emit(this.manufacture);
        this.form.reset();
        // this.formInit();
      },

      error: (error: any) => {
        this.disabledButton = false;
        this.loading = false;
        Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });
  }

  suppliers: any[] = [];  

  suppliersInit(){

    this.error = '';
    this.loading = true;

    this._supplier.index().pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
        console.log(resp);
        console.log(resp.data);
        
        this.suppliers = resp.data;
        this.loading = false;
      },
    
      error: (error: any) => {
        this.loading = false;
        this.error = 'No se pudieron consultar los proveedores. Intenta nuevamente.';
        Swal.fire('Error','Ocurrió un problema al crear. Inténtalo nuevamente.','error');
        console.error(error);
      },
    
    });
  }

}
