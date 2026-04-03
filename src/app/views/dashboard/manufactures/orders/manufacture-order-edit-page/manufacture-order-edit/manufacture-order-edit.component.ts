import { Component, effect, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { ButtonSaveComponent } from '@shared/components/buttons/button-save/button-save.component';
import Swal from 'sweetalert2';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ManufactureOrderService } from '../../manufacture.order.service';
import { SupplierService } from '@dashboard/users/suppliers/supplier.service';
import { ManufactureOrderFormComponent } from '../../manufacture-order-form/manufacture-order-form.component';
import { ActivatedRoute } from '@angular/router';
import { ManufactureService } from '@dashboard/manufactures/manufacture.service';

@Component({
  selector: 'app-manufacture-order-edit',
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    ButtonSaveComponent,
    LoadingComponent,
    ManufactureOrderFormComponent
  ],
  templateUrl: './manufacture-order-edit.component.html',
  styleUrl: './manufacture-order-edit.component.scss'
})
export class ManufactureOrderEditComponent implements OnInit, OnDestroy {

  form!: FormGroup;

  @Output() emitUpdateManufacture = new EventEmitter<any>();

  loading: boolean = false;
  disabledButton: boolean = false;
  manufacture_id: number = 0;

  constructor(
    private fb: FormBuilder,
    private _manufactureOrder: ManufactureOrderService,
    private _manufacture: ManufactureService,
    private _supplier: SupplierService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe(params => {
      this.manufacture_id = Number(params.get('order_id'));

    });

    //Escuchar cambios en la orden de compra para actualizar el formulario
    effect(() => {
      const event = this._manufacture.manufactureSingnalEvent();
      if (!event) return;
      this.form.patchValue({
        name: event.name,
        supplier_id: event.supplier_id,
        manufacture_start: event.manufacture_start.split(' ')[0],
        manufacture_end: event.manufacture_end.split(' ')[0],
      });

    });
  }

  formInit() {

    // const today = new Date().toISOString().split('T')[0];

    this.form = this.fb.group({
      name: ['', Validators.required], //Nombre del proyecto, no del producto
      supplier_id: [null],
      manufacture_start: ['', Validators.required],
      manufacture_end: ['', Validators.required],
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

    this.formInit();
    this.suppliersInit();
    console.log(this.manufacture_id);

  }

  suppliersInit(){

    this.loading = true;

    this._supplier.index().pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
        console.log(resp.data);
        this.suppliers = resp.data;
        console.log(this.manufacture_id);
        this.loading = false;
      },
    
      error: (error: any) => {
        Swal.fire('Error','Ocurrió un problema al crear. Inténtalo nuevamente.','error');
        console.error(error);
      },
    
    });

  }

  update() {

    console.log(this.form.value);

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = false;
    this.disabledButton = false;

    Swal.fire({
      title: 'Espere...',
      html: 'Guardando el registro',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    })

    this._manufactureOrder.update(this.manufacture_id, this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.manufacture = resp.data;
        this.loading = false;
        this.disabledButton = false;
        this.emitUpdateManufacture.emit(this.manufacture);
        Swal.fire({
          icon: 'success',
          title: 'Correcto',
          text: 'Datos guardados correctamente',
          confirmButtonText: 'OK',
          showConfirmButton: true
        })
        
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

}
