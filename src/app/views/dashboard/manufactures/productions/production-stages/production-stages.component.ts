import { ProductionStageAttachmentsComponent } from './production-stage-attachments.component';
import { ProductionDeliveryTrackingComponent } from '../manufacture-production-edit-page/production-delivery-tracking/production-delivery-tracking.component';
import { afterNextRender, Component, ElementRef, EventEmitter, inject, Injector, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ManufactureProductionVariantIndexComponent } from '../manufacture-production-edit-page/manufacture-production-variant-index/manufacture-production-variant-index.component';
import { ManufactureProductionKardexIndexComponent } from '../manufacture-production-edit-page/manufacture-production-kardex-index/manufacture-production-kardex-index.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { PurchaseIndexComponent } from '../../../purchases/purchase-index/purchase-index.component';
import { isProcessStage, ProductionStage, ProductionStageService, STAGE_STATUS } from './production-stage.service';
import { ProductionStageHistoryComponent } from './production-stage-history.component';

type SectionTab = 'process' | 'purchases' | 'history' | 'products' | 'receptions';

@Component({
  selector: 'app-production-stages',
  imports: [ProductionStageAttachmentsComponent, ProductionDeliveryTrackingComponent, CurrencyPipe, ReactiveFormsModule, PurchaseIndexComponent, ManufactureProductionVariantIndexComponent, ManufactureProductionKardexIndexComponent, ProductionStageHistoryComponent],
  templateUrl: './production-stages.component.html',
  styleUrl: './production-stages.component.scss',
})
export class ProductionStagesComponent implements OnInit, OnDestroy {
  @Input() productionId = 0;
  @Input() productionName = '';
  @Input() cuttingTotal = 0;
  cuttingQuantity: number | null = null;

  sectionOptionLabel(stage: ProductionStage): string {
    if (stage.code === 'reception') return stage.name;
    const count = stage.code === 'cutting' ? (this.cuttingQuantity ?? this.cuttingTotal) : (stage.purchases_count ?? 0);
    return `${stage.name} (${count})`;
  }
  @Input() purchases: any[] = [];
  @Output() totalChanged = new EventEmitter<number>();
  stages: ProductionStage[] = [];
  selected: ProductionStage | null = null;
  form!: FormGroup;
  loading = true;
  saving = false;
  uploadingFiles = false;
  assigning = false;
  error = '';
  message = '';
  classificationMessage = '';
  purchaseSearch = '';
  showAllPurchases = false;
  assignmentTargets: Record<number, number> = {};
  labels = STAGE_STATUS;
  fieldErrors: Record<string, string> = {};
  activeTab: SectionTab = 'purchases';
  readonly sectionControl = new FormControl('', { nonNullable: true });
  private readonly baseTabs: { id: SectionTab; label: string; icon: string }[] = [
    { id: 'purchases', label: 'Compras', icon: 'fa-solid fa-bag-shopping' },
    { id: 'process', label: 'Seguimiento', icon: 'fa-solid fa-truck-fast' },
    { id: 'history', label: 'Historial', icon: 'fa-solid fa-clock-rotate-left' },
  ];

  get tabs(): { id: SectionTab; label: string; icon: string }[] {
    if (this.selected?.code === 'reception') return [];
    return this.selected?.code === 'cutting'
      ? [this.baseTabs[0], { id: 'products', label: 'Productos', icon: 'fa-solid fa-shirt' }, ...this.baseTabs.slice(1)]
      : this.baseTabs;
  }
  get purchaseStages(): ProductionStage[] { return this.stages.filter(stage => stage.code !== 'reception'); }
  private initialTab(): SectionTab { return this.selected?.code === 'reception' ? 'receptions' : 'purchases'; }

  @ViewChild('completionDialog') completionDialog?: ElementRef<HTMLDialogElement>;
  @ViewChild('filesDialog') filesDialog?: ElementRef<HTMLDialogElement>;
  filesOpen = false;
  openCompletion(): void { if (!this.saving && !this.uploadingFiles) this.completionDialog?.nativeElement.showModal(); }
  openFiles(): void { this.filesOpen = true; this.filesDialog?.nativeElement.showModal(); }
  closeCompletion(): void { if (!this.saving) this.completionDialog?.nativeElement.close(); }

  setTab(tab: SectionTab, persist = true): void {
    if (this.uploadingFiles || !this.tabs.some(item => item.id === tab)) return;
    this.activeTab = tab;
    if (persist) void this.router.navigate([], { relativeTo: this.route, queryParams: { view: tab }, queryParamsHandling: 'merge' });
  }

  tabKey(event: KeyboardEvent): void {
    if (!this.tabs.length) return;
    const current = this.tabs.findIndex(tab => tab.id === this.activeTab);
    const next = event.key === 'ArrowRight' ? (current + 1) % this.tabs.length : event.key === 'ArrowLeft' ? (current + this.tabs.length - 1) % this.tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? this.tabs.length - 1 : -1;
    if (next < 0) return;
    event.preventDefault();
    this.setTab(this.tabs[next].id);
    document.getElementById(`section-tab-${this.activeTab}`)?.focus();
  }

  changeSection(select: HTMLSelectElement): void {
    const target = this.stages.find(stage => stage.id === Number(select.value));
    this.sectionControl.setValue(String(this.selected?.id ?? ''), { emitEvent: false });
    this.goTo(target);
  }

  backToSections(): void { void this.router.navigate(['../overview'], { relativeTo: this.route }); }

  async canLeaveSection(): Promise<boolean> {
    if (this.saving || this.uploadingFiles) return false;
    if (!this.form?.dirty) return true;
    const dialogWasOpen = this.completionDialog?.nativeElement.open;
    if (dialogWasOpen) this.completionDialog?.nativeElement.close();
    const result = await Swal.fire({ title: 'Hay cambios sin guardar', text: 'Si sales de esta sección se descartará el borrador del proceso.', icon: 'warning', showCancelButton: true, confirmButtonText: 'Salir de la sección', cancelButtonText: 'Seguir editando' });
    if (!result.isConfirmed && dialogWasOpen) this.completionDialog?.nativeElement.showModal();
    return result.isConfirmed;
  }

  @ViewChild('workspaceHeading') workspaceHeading?: ElementRef<HTMLElement>;
  private readonly injector = inject(Injector);
  get canTrackProgress(): boolean { return !!this.selected && (isProcessStage(this.selected) || this.selected.manual_status === true); }
  get selectedIndex(): number { return this.stages.findIndex(stage => stage.id === this.selected?.id); }
  get followingSection(): ProductionStage | undefined { return this.stages[this.selectedIndex + 1]; }
  get nextStage(): ProductionStage | undefined {
    return this.stages.slice(this.selectedIndex + 1).find(stage => stage.code !== 'others' && !stage.locked && stage.status !== 'completed');
  }
  get dateChanged(): boolean { return !!this.selected?.expected_end && this.form?.value.expected_end !== this.selected.expected_end; }
  get completionHint(): string {
    if (this.selected?.locked) return this.selected.lock_reason ?? 'Esta sección no está disponible.';
    if (!this.selected?.manual_status && !this.selected?.reuses_mold && !this.form?.value.reuses_mold && !Number(this.selected?.purchases_count)) return 'Registra una compra de esta etapa antes de completarla.';
    if (this.selected?.code === 'samples' && (!this.form?.value.sample_quantity || this.form?.value.sample_review !== 'approved')) return 'Indica la cantidad de muestras y confirma su aprobación.';
    return 'Revisa los datos y completa la etapa cuando el trabajo haya terminado.';
  }
  goTo(stage?: ProductionStage): void {
    if (stage) void this.router.navigate([], { relativeTo: this.route, queryParams: { stage: stage.slug ?? stage.id, view: stage.code === 'reception' ? 'receptions' : 'purchases' }, queryParamsHandling: 'merge' });
  }
  private focusWorkspace(): void {
    afterNextRender(() => {
      const heading = this.workspaceHeading?.nativeElement;
      const anchor = heading;
      if (anchor && (anchor.getBoundingClientRect().top < 80 || (heading?.getBoundingClientRect().top ?? 0) > window.innerHeight - 120)) {
        anchor.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      }
      heading?.focus({ preventScroll: true });
    }, { injector: this.injector });
  }
  get deliveryDefault(): boolean {
    return this.selected?.delivery_tracking_default ?? (this.selected?.code === 'samples' || this.selected?.code === 'sewing');
  }
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
    this.service.changes.pipe(takeUntil(this.destroy$)).subscribe(id => { if (id === this.productionId) this.refreshProgress(); });
    this.service.focusRequests?.pipe(takeUntil(this.destroy$)).subscribe(id => { if (id === this.productionId) this.focusWorkspace(); });
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(async params => {
      if (!this.stages.length) return;
      const tab = params.get('view');
      const target = this.findStage(params.get('stage') ?? '') ?? this.stages[0];
      const accepted = target?.id === this.selected?.id || await this.select(params.get('stage') ?? '');
      if (accepted) this.activeTab = this.tabs.some(item => item.id === tab) ? tab as SectionTab : this.initialTab();
    });
  }

  private refreshProgress(): void {
    this.service.list(this.productionId).pipe(takeUntil(this.destroy$)).subscribe({
      next: response => {
        this.stages = response.data;
        const selected = this.stages.find(stage => stage.id === this.selected?.id);
        if (!selected && !this.form?.dirty && !this.saving) {
          this.setStage(this.stages[0]);
          this.goTo(this.stages[0]);
          return;
        }
        if (selected && !this.saving) {
          if (!this.form?.dirty) {
            const message = this.message;
            this.setStage(selected);
            this.message = message;
          } else {
            const fields: (keyof ProductionStage)[] = ['responsible', 'expected_end', 'notes', 'sample_quantity', 'sample_details', 'sample_photos', 'sample_review', 'review_notes', 'reuses_mold'];
            if (fields.every(field => JSON.stringify(selected[field]) === JSON.stringify(this.selected?.[field]))) {
              // A purchase can update the status and revision while the user is still filling the form.
              this.selected = selected;
              this.form.patchValue({ status: selected.status }, { emitEvent: false });
            }
          }
        }
      },
      error: () => this.error = 'No se pudo actualizar el estado de la etapa. Recarga para comprobarlo.',
    });
  }


  load(): void {
    this.loading = true;
    this.error = '';
    this.service.list(this.productionId).pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
      next: response => {
        this.stages = response.data;
        this.setStage(this.findStage(this.route.snapshot.queryParamMap.get('stage') ?? '') ?? this.stages[0]);
        const tab = this.route.snapshot.queryParamMap.get('view');
        this.activeTab = this.tabs.some(item => item.id === tab) ? tab as SectionTab : this.initialTab();
        if (this.route.snapshot.queryParamMap.get('stage')) this.focusWorkspace();
        this.totalChanged.emit(this.total);
      },
      error: () => this.error = 'No se pudieron cargar las etapas. Reintenta la consulta.',
    });
  }

  async select(identifier: number | string): Promise<boolean> {
    const stage = this.findStage(identifier) ?? this.stages[0];
    if (!stage) return false;
    if (this.selected?.id === stage.id) { this.focusWorkspace(); return true; }
    if (this.uploadingFiles) return false;
    if (this.saving || this.form?.dirty) {
      const result = this.saving ? { isConfirmed: false } : await Swal.fire({
        title: 'Hay cambios sin guardar', text: 'Si cambias de etapa se descartarán los cambios del seguimiento.',
        icon: 'warning', showCancelButton: true, confirmButtonText: 'Cambiar etapa', cancelButtonText: 'Seguir editando',
      });
      if (!result.isConfirmed) {
        void this.router.navigate([], { relativeTo: this.route, queryParams: { stage: this.selected?.slug ?? this.selected?.id, view: this.activeTab }, queryParamsHandling: 'merge', replaceUrl: true });
        return false;
      }
    }
    this.setStage(stage);
    this.activeTab = this.initialTab();
    this.focusWorkspace();
    return true;
  }

  private findStage(identifier: number | string): ProductionStage | undefined {
    return this.stages.find(stage => stage.slug === String(identifier))
      ?? this.stages.find(stage => stage.progress_id === Number(identifier))
      ?? this.stages.find(stage => stage.id === Number(identifier));
  }

  private setStage(stage?: ProductionStage): void {
    this.selected = stage ?? null;
    this.sectionControl.setValue(String(stage?.id ?? ''), { emitEvent: false });
    this.message = '';
    this.error = '';
    this.fieldErrors = {};
    if (!stage) return;
    this.form = this.fb.group({
      status: [stage.status], responsible: [stage.responsible ?? ''], expected_end: [stage.expected_end ?? ''],
      notes: [stage.notes ?? ''], sample_quantity: [stage.sample_quantity], sample_details: [stage.sample_details ?? ''],
      date_change_reason: [''], reuses_mold: [stage.reuses_mold ?? false],
      sample_review: [stage.sample_review], review_notes: [stage.review_notes ?? ''], photos: [(stage.sample_photos ?? []).join('\n')],
    });
  }

  save(action: 'save' | 'start' | 'complete' | 'reopen' = 'save'): void {
    if (!this.selected || !this.canTrackProgress || this.saving || (action === 'save' && !this.form.dirty)) return;
    this.fieldErrors = {};
    const value = this.form.getRawValue();
    if (action === 'complete') value.status = 'completed';
    if (action === 'start') value.status = 'in_progress';
    if (action === 'reopen') value.status = this.selected.manual_status ? 'pending' : 'in_progress';
    if (this.dateChanged && !value.date_change_reason?.trim()) this.fieldErrors['date_change_reason'] = 'Explica por qué cambió la fecha acordada.';
    if (value.status === 'completed') {
      if (this.selected.locked) this.fieldErrors['status'] = this.selected.lock_reason ?? 'Esta sección no está disponible.';
      if (!this.selected.manual_status && !value.reuses_mold && !Number(this.selected.purchases_count)) this.fieldErrors['status'] = 'Registra al menos una compra en esta etapa.';
      if (this.selected.code === 'samples') {
        if (!Number.isInteger(Number(value.sample_quantity)) || Number(value.sample_quantity) < 1) this.fieldErrors['sample_quantity'] = 'Indica cuántas muestras se revisaron.';
        if (value.sample_review !== 'approved') this.fieldErrors['sample_review'] = 'Confirma la aprobación de las muestras para completar la etapa.';
      }
    }
    if (Object.keys(this.fieldErrors).length) {
      this.error = 'Revisa los campos indicados antes de continuar.';
      this.focusWorkspace();
      return;
    }
    this.saving = true;
    this.error = '';
    this.message = '';
    const payload = {
      ...value, expected_end: value.expected_end || null, sample_quantity: value.sample_quantity || null,
      revision: this.selected.revision, sample_photos: value.photos.split('\n').map((url: string) => url.trim()).filter(Boolean),
    };
    delete payload.photos;
    this.service.save(this.productionId, this.selected.slug ?? this.selected.id, payload).pipe(takeUntil(this.destroy$), finalize(() => this.saving = false)).subscribe({
      next: response => {
        this.stages = this.stages.map(stage => stage.id === response.data.id ? response.data : stage);
        this.setStage(response.data);
        if (action === 'complete') this.completionDialog?.nativeElement.close();
        this.message = action === 'complete' ? `${response.data.name}: etapa completada.` : 'Cambios guardados.';
      },
      error: response => {
        const errors = response.error?.errors;
        this.fieldErrors = Object.fromEntries(Object.entries(errors ?? {}).map(([field, messages]) => [field, (messages as string[]).join(' ')]));
        this.error = errors ? Object.values(errors).flat().join(' ') : 'No se pudo guardar. Tus cambios se mantienen para reintentar.';
      },
    });
  }

  private purchaseSource?: any[];
  private purchaseStageId?: number;
  private selectedPurchases: any[] = [];
  get stagePurchases(): any[] {
    // Keep child inputs stable while the user types in the process form.
    if (this.purchaseSource !== this.purchases || this.purchaseStageId !== this.selected?.id) {
      this.purchaseSource = this.purchases;
      this.purchaseStageId = this.selected?.id;
      this.selectedPurchases = this.purchases.filter(purchase => purchase.production_stage_id === this.selected?.id);
    }
    return this.selectedPurchases;
  }
  get unclassified(): any[] { return this.purchases.filter(purchase => !purchase.production_stage_id); }
  get hasOtherSection(): boolean { return this.stages.some(stage => stage.code === 'others'); }
  get classificationPurchases(): any[] {
    const term = this.purchaseSearch.trim().toLocaleLowerCase();
    return (this.showAllPurchases ? this.purchases : this.unclassified).filter(purchase =>
      !term || [purchase.id, purchase.supplier?.user?.name, purchase.supplier?.name,
        ...(purchase.items ?? []).map((item: any) => item.name)].join(' ').toLocaleLowerCase().includes(term));
  }
  concepts(purchase: any): string { return (purchase.items ?? []).map((item: any) => item.name).filter(Boolean).join(' · ') || 'Sin conceptos'; }
  classify(): void {
    if (this.assigning || !this.unclassified.length) return;
    this.assigning = true;
    this.classificationMessage = '';
    this.service.classify(this.productionId).pipe(takeUntil(this.destroy$), finalize(() => this.assigning = false)).subscribe({
      next: ({ data }) => {
        this.purchases = data.purchases;
        this.totalChanged.emit(this.total);
        this.classificationMessage = `${data.assigned} compras clasificadas. ${this.hasOtherSection ? 'Las compras sin coincidencia se asignan a Otros.' : 'Solo se utilizan las secciones incluidas en esta producción.'}`;
        if (data.remaining) this.classificationMessage += ` ${data.remaining} no se pudieron clasificar.`;
      },
      error: () => this.classificationMessage = 'No se pudieron clasificar las compras. Intenta nuevamente.',
    });
  }
  amount(purchase: any): number { return (purchase.items ?? []).reduce((total: number, item: any) => total + Number(item.quantity || 0) * Number(item.price || 0), 0); }
  get total(): number { return this.purchases.reduce((total, purchase) => total + this.amount(purchase), 0); }

  purchasesUpdated(purchases: any[]): void {
    this.purchases = [...this.purchases.filter(purchase => purchase.production_stage_id !== this.selected?.id), ...purchases];
    this.totalChanged.emit(this.total);
    this.service.changes.next(this.productionId);
  }

  assign(purchaseId: number, stageId: string): void {
    if (!stageId || this.assigning) return;
    this.assigning = true;
    this.service.assign(this.productionId, Number(stageId), purchaseId).pipe(takeUntil(this.destroy$), finalize(() => this.assigning = false)).subscribe({
      next: response => {
        this.purchases = this.purchases.map(purchase => purchase.id === purchaseId ? response.data : purchase);
        this.classificationMessage = 'Compra asignada al grupo seleccionado.';
      },
      error: () => this.classificationMessage = 'No se pudo clasificar la compra. Intenta nuevamente.',
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
