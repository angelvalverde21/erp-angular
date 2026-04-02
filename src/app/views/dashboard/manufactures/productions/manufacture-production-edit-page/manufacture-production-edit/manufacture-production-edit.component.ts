import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ButtonSaveComponent } from '@shared/components/buttons/button-save/button-save.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { SupplierSelectedComponent } from '@dashboard/users/suppliers/supplier-selected/supplier-selected.component';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ManufactureProductionFormComponent } from '../../manufacture-production-form/manufacture-production-form.component';
import { ManufactureProductionService } from '../../manufacture.production.service';
import { ManufactureOrderService } from '../../../orders/manufacture.order.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ManufactureService } from '../../../manufacture.service';

@Component({
  selector: 'app-manufacture-production-edit',
  imports: [
    ManufactureProductionFormComponent,
    ReactiveFormsModule,
    ButtonSaveComponent,
    JsonPipe,
    LoadingComponent,
    SupplierSelectedComponent,
    FontAwesomeModule
  ],
  templateUrl: './manufacture-production-edit.component.html',
  styleUrl: './manufacture-production-edit.component.scss'
})
export class ManufactureProductionEditComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  faUser = faUser;

  @Input() type: string = 'production';
  @Input() production: any;

  loading: boolean = false;
  disabledButton: boolean = false;
  manufacture_id: number = 0;

  constructor(
    private fb: FormBuilder,
    private _manufactureProduction: ManufactureProductionService,
    private _manufacture: ManufactureService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe(params => {
      this.manufacture_id = Number(params.get('production_id'));
    });
  }

  ngOnInit(): void {

    console.log(this.manufacture_id);

    this.formInit();

    this.manufactureInit();

  }

  manufactureInit() {

    this.loading = true;

    this._manufacture.get(this.manufacture_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.production = resp.data;
        this.form.patchValue({
          name: this.production.name,
          manufacture_start: this.production.manufacture_start?.split(' ')[0],
          manufacture_end: this.production.manufacture_end?.split(' ')[0],
        });
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });
  }

  formInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      manufacture_start: ['', Validators.required],
      manufacture_end: ['', Validators.required],
    });
  }

  update() {

    console.log("click ok");
    
    console.log(this.form.value);

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.disabledButton = true;

    this._manufactureProduction.update(this.production.id, this.form.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({

        next: (resp: any) => {
          console.log(resp);
          this.disabledButton = false;
        },

        error: (error: any) => {
          console.error(error);
          this.disabledButton = false;
        },

      });
  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}