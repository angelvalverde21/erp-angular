import { Component, OnDestroy, OnInit, effect } from '@angular/core';
// import { HeadPageComponent } from '@components/head-page/head-page.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { isProcessStage, ProductionStage, ProductionStageService } from '../production-stages/production-stage.service';
import { ProductionStageStepperComponent } from '../production-stages/production-stage-stepper.component';
import { EMPTY, Subject, catchError, filter, switchMap, takeUntil, tap } from 'rxjs';
import { LoadingComponent } from '@components/loading/loading.component';
import Swal from 'sweetalert2';
// import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ManufactureProductionService } from '../manufacture.production.service';
import { ProductionWidgetComponent } from './production-widget/production-widget.component';
import { SummaryPurchase } from '@interfaces/summary.interface';
import { ManufactureService } from '../../manufacture.service';

@Component({
  selector: 'app-manufacture-production-edit-page',
  imports: [
    LoadingComponent,
    ProductionWidgetComponent,
    RouterModule,
    ProductionStageStepperComponent,
    // NgbDropdownModule
  ],
  templateUrl: './manufacture-production-edit-page.component.html',
  styleUrl: './manufacture-production-edit-page.component.scss'

})

export class ManufactureProductionEditPageComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  error = '';
  manufacture: any = null;
  manufacture_id: number = 0;
  stages: ProductionStage[] = [];
  stagesError = '';
  get showWorkflow(): boolean { return this.router.url.split('?')[0].endsWith('/purchases'); }
  get workflowStages(): (ProductionStage & { status: string })[] { return this.stages.filter(isProcessStage); }
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
      switchMap(() => this._manufacture.get(this.manufacture_id).pipe(catchError(() => EMPTY))),
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
    void this.router.navigate(['purchases'], { relativeTo: this.route, queryParams: { stage: stage?.slug ?? id } });
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

    this._manufacture.get(this.manufacture_id).pipe(takeUntil(this.destroy$)).subscribe({

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
