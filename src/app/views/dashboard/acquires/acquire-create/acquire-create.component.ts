import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { ButtonSaveComponent } from '@shared/components/buttons/button-save/button-save.component';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { AcquireService } from '../acquire.service';
import { SupplierService } from '@dashboard/users/suppliers/supplier.service';
import { AcquireFormComponent } from '../acquire-form/acquire-form.component';

@Component({
  selector: 'app-acquire-create',
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    ButtonSaveComponent,
    LoadingComponent,
    AcquireFormComponent
  ],
  templateUrl: './acquire-create.component.html',
  styleUrl: './acquire-create.component.scss'
})
export class AcquireCreateComponent implements OnInit, OnDestroy {

  form!: FormGroup;

  @Output() emitCreateAcquire = new EventEmitter<any>();

  loading: boolean = false;
  disabledButton: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _acquire: AcquireService,
    private _supplier: SupplierService
  ) {

  }

  formInit() {

    const today = new Date().toISOString().split('T')[0];

    this.form = this.fb.group({
      name: ['', Validators.required], //Nombre del proyecto, no del producto
      supplier_id: [null],
      date_start: [today],
      date_end: [today],
      description: [''],
      // quantity_total: ['', Validators.required],
    });
  }

  destroy$ = new Subject<void>();

  acquire: any;

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  ngOnInit(): void {
    this.suppliersInit();
    this.formInit();
  }

  create() {

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

    this._acquire.store(this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        this.acquire = resp.data;
        this.loading = false;
        this.disabledButton = false;
        this.emitCreateAcquire.emit(this.acquire);
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

    this.loading = true;

    this._supplier.index().pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
        console.log(resp);
        console.log(resp.data);
        
        this.suppliers = resp.data;
        this.loading = false;
      },
    
      error: (error: any) => {
        Swal.fire('Error','Ocurrió un problema al crear. Inténtalo nuevamente.','error');
        console.error(error);
      },
    
    });
  }

}
