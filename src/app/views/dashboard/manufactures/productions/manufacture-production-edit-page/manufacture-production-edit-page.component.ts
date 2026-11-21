import { ProductionSectionOption, ProductionSectionPickerComponent } from '../production-stages/production-section-picker.component';
import { Component, OnDestroy, OnInit, effect } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
// import { HeadPageComponent } from '@components/head-page/head-page.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { isProcessStage, ProductionStage, ProductionStageService } from '../production-stages/production-stage.service';
import { ProductionStageStepperComponent } from '../production-stages/production-stage-stepper.component';
import { EMPTY, Subject, catchError, filter, finalize, switchMap, takeUntil, tap } from 'rxjs';
import { LoadingComponent } from '@components/loading/loading.component';
import Swal from 'sweetalert2';
// import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ManufactureProductionService } from '../manufacture.production.service';
import { SummaryPurchase } from '@interfaces/summary.interface';
import { ManufactureService } from '../../manufacture.service';

@Component({
  selector: 'app-manufacture-production-edit-page',
  imports: [
    LoadingComponent,
    CurrencyPipe,
    RouterModule,
    ProductionStageStepperComponent,
    ProductionSectionPickerComponent,
    // NgbDropdownModule
  ],
  templateUrl: './manufacture-production-edit-page.component.html',
  styleUrl: './manufacture-production-edit-page.component.scss'

})

export class ManufactureProductionEditPageComponent implements OnInit, OnDestroy {

  configuringSections = false;
  loadingSections = false;
  savingSections = false;
  sectionOptions: ProductionSectionOption[] = [];
  selectedSectionIds: number[] = [];
  sectionRevision = 0;
  sectionError = '';

  async manageSections(): Promise<void> {
    if (this.savingSections) return;
    this.configuringSections = true;
    this.loadingSections = true;
    this.sectionError = '';
    this.stageService.configuration(this.manufacture_id).pipe(takeUntil(this.destroy$), finalize(() => this.loadingSections = false)).subscribe({
      next: ({ data }) => { this.sectionOptions = data.options; this.selectedSectionIds = data.options.filter(section => section.is_enabled).map(section => section.id); this.sectionRevision = data.revision; },
      error: () => this.sectionError = 'No se pudieron cargar las secciones. Cierra y vuelve a intentar.',
    });
  }

  saveSections(): void {
    if (this.savingSections || this.loadingSections) return;
    if (!this.selectedSectionIds.length) { this.sectionError = 'Selecciona al menos una sección.'; return; }
    this.savingSections = true;
    this.sectionError = '';
    this.stageService.configure(this.manufacture_id, this.selectedSectionIds, this.sectionRevision).pipe(takeUntil(this.destroy$), finalize(() => this.savingSections = false)).subscribe({
      next: () => { this.configuringSections = false; },
      error: response => this.sectionError = response.error?.errors ? Object.values(response.error.errors).flat().join(' ') : 'No se pudieron guardar las secciones. Tu selección se mantiene.',
    });
  }

  loading: boolean = false;
  error = '';
  manufacture: any = null;
  manufacture_id: number = 0;
  stages: ProductionStage[] = [];
  stagesError = '';
  get sectionMode(): boolean { return this.router.url.split('?')[0].endsWith('/purchases'); }
  get overviewMode(): boolean { return this.router.url.split('?')[0].endsWith('/overview'); }
  get workflowStages(): (ProductionStage & { status: string })[] { return this.stages.filter(isProcessStage); }
  get navigationStages(): ProductionStage[] { return this.stages.filter(stage => stage.show_in_stepper !== false); }
  get activeStageId(): number {
    const path = this.router.url.split('?')[0];
    if (path.endsWith('/kardexes')) return this.stages.find(stage => stage.code === 'reception')?.id ?? 0;
    if (path.endsWith('/variants')) return this.stages.find(stage => stage.code === 'cutting')?.id ?? 0;
    return path.endsWith('/purchases') ? this.selectedStageId : 0;
  }
  get cuttingSection(): ProductionStage | undefined { return this.stages.find(stage => stage.code === 'cutting'); }
  get receptionSection(): ProductionStage | undefined { return this.stages.find(stage => stage.code === 'reception'); }
  get unitCost(): number { return Number(this.summary.sum_variants) > 0 ? Number(this.summary.sum_purchases) / Number(this.summary.sum_variants) : 0; }
  get otherExpenses(): { id: number; count: number } | null {
    const section = this.stages.find(stage => stage.code === 'others');
    return section ? { id: section.id, count: section.purchases_count ?? 0 } : null;
  }
  get productionStatus(): string {
    if (!this.workflowStages.length) return 'Sin seguimiento';
    if (this.workflowStages.every(stage => ['completed', 'not_applicable'].includes(stage.status))) return 'Completada';
    return this.workflowStages.some(stage => ['in_progress', 'completed'].includes(stage.status)) ? 'En proceso' : 'Pendiente';
  }
  selectedStageId = 0;
  purchases: any;
  variants: any;

  // summary: any;--------------------------------------*

  modal: any;
  manufacture_variants: any;

  constructor(
    private route: ActivatedRoute,
    private _manufacture: ManufactureService,
    private _manufactureProduction: ManufactureProductionService,
    private stageService: ProductionStageService,
    private router: Router,
  ) {

    this.route.params.subscribe(params => {
      this.manufacture_id = Number(params['production_id']);
    });


    //Escuchar cambios en el resumen de compras y actualizar el widget de resumen en consecuencia
    effect(() => {

      const production = this._manufacture.manufactureSingnalEvent();
      if (production?.id === this.manufacture_id) this.manufacture = production;
      const event = this._manufacture.summaryEvent();

      if (!event) return;

      this.summary = {
        ...this.summary,
        ...event,
      }

      console.log('Summary actualizado:', event);
      console.log(this.summary);

    });

  }

  ngOnInit(): void {


    this.productionInit();
    this.loadStages();
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(params => this.selectedStageId = this.resolveStage(params.get('stage'))?.id ?? this.workflowStages[0]?.id ?? 0);
    this.stageService.changes.pipe(
      filter(id => id === this.manufacture_id),
      tap(() => this.loadStages()),
      switchMap(() => this._manufacture.overview(this.manufacture_id).pipe(catchError(() => EMPTY))),
      takeUntil(this.destroy$),
    ).subscribe(response => {
      this.summary = { ...this.summary, tracked_purchases_count: Number(response.data.tracked_purchases_count ?? 0) };
    });

  }

  summary: SummaryPurchase = {
    sum_variants: 0,
    count_variants: 0,
    sum_purchases: 0,
    sum_kardexes: 0,
    tracked_purchases_count: 0,
  };

  loadStages(): void {
    this.stageService.list(this.manufacture_id).pipe(takeUntil(this.destroy$)).subscribe({
      next: response => {
        this.stages = response.data;
        this.selectedStageId = this.resolveStage(this.route.snapshot.queryParamMap.get('stage'))?.id ?? this.workflowStages[0]?.id ?? 0;
        this.stagesError = '';
      },
      error: () => this.stagesError = 'No se pudo consultar el avance por etapas.',
    });
  }

  openStage(id: number): void {
    const stage = this.stages.find(section => section.id === id);
    if (id === this.selectedStageId && this.sectionMode) {
      this.stageService.focusRequests.next(this.manufacture_id);
      return;
    }
    void this.router.navigate(['purchases'], { relativeTo: this.route, queryParams: { stage: stage?.slug ?? id, view: stage?.code === 'reception' ? 'receptions' : 'purchases' } });
  }

  private resolveStage(identifier: string | null): ProductionStage | undefined {
    if (!identifier) return undefined;
    return this.stages.find(stage => stage.slug === identifier)
      ?? this.stages.find(stage => stage.progress_id === Number(identifier))
      ?? this.stages.find(stage => stage.id === Number(identifier));
  }

  //usado
  productionInit() {

    this.error = '';
    this.loading = true;

    this._manufacture.overview(this.manufacture_id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {

        console.log(resp);
        this.manufacture = resp.data;
        this._manufacture.setManufacture(this.manufacture);

        this.summary = {
          sum_variants: this.manufacture.sum_variants,
          count_variants: this.manufacture.count_variants,
          sum_purchases: this.manufacture.sum_purchases,
          sum_kardexes: this.manufacture.sum_kardexes,
          tracked_purchases_count: Number(this.manufacture.tracked_purchases_count ?? 0),
        }

        // this.summary = {
        //   cost: resp.data.purchase_total / resp.data.variants_sum_quantity ? resp.data.purchase_total / resp.data.variants_sum_quantity : 0,
        //   sum_products: resp.data.variants_sum_quantity,
        //   sum_purchases: resp.data.purchase_total,
        //   sum_reception: resp.data.kardexes_sum_quantity
        // }

        this.loading = false;

        // this.calculeCost();
      },

      error: (error: any) => {
        this.loading = false;
        this.error = 'No se pudo consultar la producción. Intenta nuevamente.';
        Swal.fire('Error', 'Ocurrió un problema. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });
  }

  // calculeCost() {
  //   this.total_cost = Math.round(this.total_purchases_amount / this.total_products * 100) / 100;
  // }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }


}
