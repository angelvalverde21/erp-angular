import { Component, effect, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { ButtonSaveComponent } from '@shared/components/buttons/button-save/button-save.component';
import Swal from 'sweetalert2';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { SupplierService } from '@dashboard/users/suppliers/supplier.service';
import { AcquireFormComponent } from '../../../acquire-form/acquire-form.component';
import { ActivatedRoute } from '@angular/router';
import { AcquireService } from '../../../acquire.service';

@Component({
  selector: 'app-acquire-edit',
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    ButtonSaveComponent,
    LoadingComponent,
    AcquireFormComponent,
  ],
  templateUrl: './acquire-edit.component.html',
  styleUrl: './acquire-edit.component.scss'
})
export class AcquireEditComponent implements OnInit, OnDestroy {

  form!: FormGroup;

  @Output() emitUpdateAcquire = new EventEmitter<any>();

  loading: boolean = false;
  disabledButton: boolean = false;
  acquire_id: number = 0;

  @Input() acquire: any;
  // @Input() suppliers: any; 

  constructor(
    private fb: FormBuilder,
    private _acquire: AcquireService,
    private _supplier: SupplierService,
    private route: ActivatedRoute
  ) {
    // this.route.paramMap.subscribe(params => {
    //   this.acquire_id = Number(params.get('order_id'));

    // });

    //Escuchar cambios en la orden de compra para actualizar el formulario
    // effect(() => {
    //   const event = this._manufacture.manufactureSingnalEvent();
    //   if (!event) return;


    // });
  }

  formInit() {

    // const today = new Date().toISOString().split('T')[0];

    this.form = this.fb.group({
      name: ['', Validators.required], //Nombre del proyecto, no del producto
      description: [''],
      supplier_id: [null],
      date_start: ['', Validators.required],
      date_end: ['', Validators.required],
      // quantity_total: ['', Validators.required],
    });
  }

  destroy$ = new Subject<void>();
  
  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  ngOnInit(): void {

    // console.log(this.manufacture_order);
    this.formInit();

    this.suppliersInit();

    this.form.patchValue({
      name: this.acquire.name,
      description: this.acquire.description,
      supplier_id: this.acquire.supplier_id,
      date_start: this.acquire.date_start.split(' ')[0],
      date_end: this.acquire.date_end.split(' ')[0],
    });

    console.log(this.acquire.id);

  }

  suppliersInit() {

    this.loading = true;

    this._supplier.index().pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp.data);
        this.suppliers = resp.data;
        // console.log(this.acquire_id);
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
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

    this._acquire.update(this.acquire.id, this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.acquire = resp.data;
        this.loading = false;
        this.disabledButton = false;
        this.emitUpdateAcquire.emit(this.acquire);
        Swal.fire({
          icon: 'success',
          title: 'Correcto',
          text: 'Datos guardados correctamente',
          showConfirmButton: false,
          timer: 500
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
