import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';
import { SupplierService } from '@dashboard/users/suppliers/supplier.service';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ManufactureProductionService } from '../manufacture.production.service';
import { ManufactureProductionFormComponent } from '../manufacture-production-form/manufacture-production-form.component';
import { ProductionStageService } from '../production-stages/production-stage.service';
import { ProductionSectionOption, ProductionSectionPickerComponent } from '../production-stages/production-section-picker.component';

@Component({
  selector: 'app-manufacture-production-create',
  imports: [
    ManufactureProductionFormComponent,
    ProductionSectionPickerComponent,
    ReactiveFormsModule,
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
  sectionOptions: ProductionSectionOption[] = [];
  selectedSectionIds: number[] = [];
  loadingSections = false;
  sectionsError = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private _manufactureProduction: ManufactureProductionService,
    private stageService: ProductionStageService,
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
    this.loadSections();
  }

  loadSections(): void {
    this.loadingSections = true;
    this.sectionsError = '';
    this.stageService.templates().pipe(takeUntil(this.destroy$)).subscribe({
      next: response => { this.sectionOptions = response.data; this.selectedSectionIds = response.data.map(section => section.id); this.loadingSections = false; },
      error: () => { this.loadingSections = false; this.sectionsError = 'No se pudieron cargar las secciones. Intenta nuevamente.'; },
    });
  }

  createProduction() {

    if (this.disabledButton || this.loadingSections || this.sectionsError) return;
    this.error = '';
    if (!this.selectedSectionIds.length) { this.error = 'Selecciona al menos una sección para esta producción.'; return; }

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

    this._manufactureProduction.store({ ...this.form.value, stage_ids: this.selectedSectionIds }).pipe(takeUntil(this.destroy$)).subscribe({

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
        this.error = error.error?.errors ? Object.values(error.error.errors).flat().join(' ') : 'No se pudo crear la producción. Tus datos se mantienen para reintentar.';
        this.disabledButton = false;
        this.loading = false;
        Swal.close();
        console.error(error);
      },

    });
  }


}
