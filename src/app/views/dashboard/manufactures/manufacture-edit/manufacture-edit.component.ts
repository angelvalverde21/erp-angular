import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ManufactureFormComponent } from '../manufacture-form/manufacture-form.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ManufactureService } from '../manufacture.service';
import { ButtonSaveComponent } from '../../../shared/components/buttons/button-save/button-save.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { SupplierSelectedComponent } from '../../users/suppliers/supplier-selected/supplier-selected.component';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-manufacture-edit',
  imports: [
    ManufactureFormComponent,
    ReactiveFormsModule,
    ButtonSaveComponent,
    JsonPipe,
    LoadingComponent,
    SupplierSelectedComponent,
    FontAwesomeModule
  ],
  templateUrl: './manufacture-edit.component.html',
  styleUrl: './manufacture-edit.component.scss'
})
export class ManufactureEditComponent implements OnInit, OnDestroy {


  form!: FormGroup;
  faUser = faUser;
  @Input() type: string = 'production';
  loading: boolean = false;
  disabledButton: boolean = false;

  @Input() manufacture: any;

  constructor(
    private fb: FormBuilder,
    private _manufacture: ManufactureService
  ) {

  }

  ngOnInit(): void {
    console.log(this.manufacture);

    this.formInit();
    this.form.patchValue(this.manufacture);
  }

  formInit() {
    this.form = this.fb.group({
      name: ['', Validators.required], //Nombre del proyecto, no del producto
      // budget: ['', Validators.required],
      // quantity_total: ['', Validators.required],
      supplier_id: [''],
    });
  }

  updateManufacture() {

    console.log(this.form.value);
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this._manufacture.update(this.manufacture.id, this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        // Swal.fire('Guardado', 'El registro ha sido actualizado', 'success');
        console.log(resp);
        this.loading = false;
      },

      error: (error: any) => {
        // Swal.fire('Error', 'Ocurrió un problema al guardar. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });

  }


  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

}
