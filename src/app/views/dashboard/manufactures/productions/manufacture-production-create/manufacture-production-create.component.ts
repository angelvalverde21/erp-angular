import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { ButtonSaveComponent } from '@shared/components/buttons/button-save/button-save.component';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';
import { SupplierService } from '@dashboard/users/suppliers/supplier.service';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ManufactureProductionService } from '../manufacture.production.service';
import { ManufactureProductionFormComponent } from '../manufacture-production-form/manufacture-production-form.component';

@Component({
  selector: 'app-manufacture-production-create',
  imports: [
    ManufactureProductionFormComponent,
    ReactiveFormsModule,
    JsonPipe,
    ButtonSaveComponent,
    LoadingComponent
  ],
  templateUrl: './manufacture-production-create.component.html',
  styleUrl: './manufacture-production-create.component.scss'
})
export class ManufactureProductionCreateComponent implements OnInit, OnDestroy {

  form!: FormGroup;

  @Output() emitCreateProduction = new EventEmitter<any>();

  @Input() type: string = 'production';

  loading: boolean = false;
  disabledButton: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _manufactureProduction: ManufactureProductionService,
  ) {

  }

  formInit() {

    const today = new Date().toISOString().split('T')[0];

    this.form = this.fb.group({
      name: ['', Validators.required], //Nombre del proyecto, no del producto
      // manufacture_start: [today, Validators.required],
      // manufacture_end: [today, Validators.required],
      // quantity_total: ['', Validators.required],
    });
  }

  destroy$ = new Subject<void>();

  production: any;

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  ngOnInit(): void {
    this.formInit();
  }

  createProduction() {

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

    this._manufactureProduction.store(this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        this.production = resp.data;
        this.loading = false;
        this.disabledButton = false;
        this.emitCreateProduction.emit(this.production);
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


}
