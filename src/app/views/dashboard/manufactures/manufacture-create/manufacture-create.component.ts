import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ManufactureFormComponent } from '../manufacture-form/manufacture-form.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { ButtonSaveComponent } from '@shared/components/buttons/button-save/button-save.component';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';
import { ManufactureService } from '../manufacture.service';
import { SupplierService } from '../../users/suppliers/supplier.service';
import { LoadingComponent } from '@shared/components/loading/loading.component';

@Component({
  selector: 'app-manufacture-create',
  imports: [
    ManufactureFormComponent,
    ReactiveFormsModule,
    JsonPipe,
    ButtonSaveComponent,
    LoadingComponent
  ],
  templateUrl: './manufacture-create.component.html',
  styleUrl: './manufacture-create.component.scss'
})
export class ManufactureCreateComponent implements OnInit, OnDestroy {

  form!: FormGroup;

  @Output() emitCreateManufacture = new EventEmitter<any>();

  @Input() type: string = 'production';

  loading: boolean = false;
  disabledButton: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _manufacture: ManufactureService,
    private _supplier: SupplierService
  ) {

  }

  formInit() {

    const today = new Date().toISOString().split('T')[0];

    this.form = this.fb.group({
      name: ['', Validators.required], //Nombre del proyecto, no del producto
      type: [this.type, Validators.required],
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

    this._manufacture.store(this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

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
