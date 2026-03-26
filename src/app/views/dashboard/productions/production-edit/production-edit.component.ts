import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ProductionFormComponent } from '../production-form/production-form.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ProductionService } from '../production.service';
import { ButtonSaveComponent } from '../../../shared/components/buttons/button-save/button-save.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { SupplierSelectedComponent } from '../../users/suppliers/supplier-selected/supplier-selected.component';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-production-edit',
  imports: [
    ProductionFormComponent,
    ReactiveFormsModule,
    ButtonSaveComponent,
    JsonPipe,
    LoadingComponent,
    SupplierSelectedComponent,
    FontAwesomeModule
  ],
  templateUrl: './production-edit.component.html',
  styleUrl: './production-edit.component.scss'
})
export class ProductionEditComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  faUser = faUser;

  @Input() type: string = 'production';
  @Input() production: any;

  loading: boolean = false;
  disabledButton: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _production: ProductionService
  ) {}

  ngOnInit(): void {
    console.log(this.production);

    this.formInit();
    this.form.patchValue(this.production);
  }

  formInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      supplier_id: [''],
    });
  }

  updateProduction() {

    console.log(this.form.value);

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this._production.update(this.production.id, this.form.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({

        next: (resp: any) => {
          console.log(resp);
          this.loading = false;
        },

        error: (error: any) => {
          console.error(error);
          this.loading = false;
        },

      });
  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}