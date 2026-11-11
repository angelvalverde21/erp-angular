import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { PurchaseIndexComponent } from '../../../purchases/purchase-index/purchase-index.component';
import { ImagePreviewComponent } from '../../../../shared/components/image-preview/image-preview.component';
import { ProductionStage, ProductionStageService, STAGE_STATUS } from './production-stage.service';

@Component({
  selector: 'app-production-stages',
  imports: [CurrencyPipe, DatePipe, ReactiveFormsModule, PurchaseIndexComponent, ImagePreviewComponent],
  templateUrl: './production-stages.component.html',
  styleUrl: './production-stages.component.scss',
})
export class ProductionStagesComponent implements OnInit, OnDestroy {
  @Input() productionId = 0;
  @Input() purchases: any[] = [];
  @Output() totalChanged = new EventEmitter<number>();
  stages: ProductionStage[] = [];
  selected: ProductionStage | null = null;
  form!: FormGroup;
  loading = true;
  saving = false;
  assigning = false;
  error = '';
  message = '';
  labels = STAGE_STATUS;
  descriptions: Record<string, string> = {
    molds: 'Desarrollo del molde, escalado de tallas y servicio de ploteo. Puede reutilizarse un molde existente.',
    samples: 'Confecciona y revisa las muestras antes de fabricar el lote. Estas unidades no se suman al lote ni al stock.',
    materials: 'Compra de telas, forros, hilos, botones, cierres y demás insumos del lote.',
    cutting: 'Tizado, tendido y corte de las prendas. Registra los servicios de esta etapa.',
    sewing: 'Confección y armado del lote. Registra el taller y la fecha de entrega comprometida por el costurero.',
    finishing: 'Estampado, bordado, lavado, limpieza y planchado, según la prenda.',
  };
  private readonly destroy$ = new Subject<void>();

  constructor(private service: ProductionStageService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.load();
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = Number(params.get('stage'));
      if (this.stages.length) void this.select(id);
    });
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.service.list(this.productionId).pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
      next: response => {
        this.stages = response.data;
        this.setStage(this.stages.find(stage => stage.id === Number(this.route.snapshot.queryParamMap.get('stage'))) ?? this.stages[0]);
        this.totalChanged.emit(this.total);
      },
      error: () => this.error = 'No se pudieron cargar las etapas. Reintenta la consulta.',
    });
  }

  async select(id: number): Promise<void> {
    const stage = this.stages.find(item => item.id === id) ?? this.stages[0];
    if (!stage || this.selected?.id === stage.id) return;
    if (this.saving || this.form?.dirty) {
      const result = this.saving ? { isConfirmed: false } : await Swal.fire({
        title: 'Hay cambios sin guardar', text: 'Si cambias de etapa se descartarán los cambios del seguimiento.',
        icon: 'warning', showCancelButton: true, confirmButtonText: 'Cambiar etapa', cancelButtonText: 'Seguir editando',
      });
      if (!result.isConfirmed) {
        void this.router.navigate([], { relativeTo: this.route, queryParams: { stage: this.selected?.id }, queryParamsHandling: 'merge', replaceUrl: true });
        return;
      }
    }
    this.setStage(stage);
  }

  private setStage(stage?: ProductionStage): void {
    this.selected = stage ?? null;
    this.message = '';
    this.error = '';
    if (!stage) return;
    this.form = this.fb.group({
      status: [stage.status], responsible: [stage.responsible ?? ''], expected_end: [stage.expected_end ?? ''],
      notes: [stage.notes ?? ''], sample_quantity: [stage.sample_quantity], sample_details: [stage.sample_details ?? ''],
      date_change_reason: [''],
      sample_review: [stage.sample_review], review_notes: [stage.review_notes ?? ''], photos: [(stage.sample_photos ?? []).join('\n')],
    });
  }

  save(): void {
    if (!this.selected || this.saving || !this.form.dirty) return;
    this.saving = true;
    this.error = '';
    this.message = '';
    const value = this.form.getRawValue();
    const payload = {
      ...value, expected_end: value.expected_end || null, sample_quantity: value.sample_quantity || null,
      revision: this.selected.revision, sample_photos: value.photos.split('\n').map((url: string) => url.trim()).filter(Boolean),
    };
    delete payload.photos;
    this.service.save(this.productionId, this.selected.id, payload).pipe(takeUntil(this.destroy$), finalize(() => this.saving = false)).subscribe({
      next: response => {
        this.stages = this.stages.map(stage => stage.id === response.data.id ? response.data : stage);
        this.setStage(response.data);
        this.message = 'Seguimiento guardado. El avance ya está disponible para el equipo y el CEO.';
      },
      error: response => {
        const errors = response.error?.errors;
        this.error = errors ? Object.values(errors).flat().join(' ') : 'No se pudo guardar. Tus cambios se mantienen para reintentar.';
      },
    });
  }

  get stagePurchases(): any[] { return this.purchases.filter(purchase => purchase.production_stage_id === this.selected?.id); }
  get unclassified(): any[] { return this.purchases.filter(purchase => !purchase.production_stage_id); }
  amount(purchase: any): number { return (purchase.items ?? []).reduce((total: number, item: any) => total + Number(item.quantity || 0) * Number(item.price || 0), 0); }
  get total(): number { return this.purchases.reduce((total, purchase) => total + this.amount(purchase), 0); }

  purchasesUpdated(purchases: any[]): void {
    this.purchases = [...this.purchases.filter(purchase => purchase.production_stage_id !== this.selected?.id), ...purchases];
    this.totalChanged.emit(this.total);
  }

  assign(purchaseId: number, stageId: string): void {
    if (!stageId || this.assigning) return;
    this.assigning = true;
    this.service.assign(this.productionId, Number(stageId), purchaseId).pipe(takeUntil(this.destroy$), finalize(() => this.assigning = false)).subscribe({
      next: response => { this.purchases = this.purchases.map(purchase => purchase.id === purchaseId ? response.data : purchase); },
      error: () => this.error = 'No se pudo clasificar la compra. Intenta nuevamente.',
    });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
