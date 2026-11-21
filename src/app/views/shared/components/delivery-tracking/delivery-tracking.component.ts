import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, inject } from '@angular/core';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, Subject, takeUntil } from 'rxjs';
import { DELIVERY_LABELS, DeliveryDates, DeliveryEvent, DeliveryTracking, todayInLima } from './delivery-tracking.model';
import { DeliveryTrackingService } from './delivery-tracking.service';
import { DeliveryTimelineComponent } from './delivery-timeline.component';

type EditMode = 'create' | 'reschedule' | 'receive' | 'correct';

@Component({
  selector: 'app-delivery-tracking',
  imports: [DatePipe, NgTemplateOutlet, ReactiveFormsModule, DeliveryTimelineComponent],
  templateUrl: './delivery-tracking.component.html',
  styleUrl: './delivery-tracking.component.scss',
})
export class DeliveryTrackingComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) ownerId = 0;
  @Input() ownerType = 'purchase';
  @Input() tracking: DeliveryTracking | null = null;
  @Input() suggested = false;
  @Input() footer = false;
  @Input() actionsFirst = false;
  @Input() controlsOnly = false;
  @Input() historyAlwaysVisible = false;
  @Input() externalToggle = false;
  @Input() embedded = false;
  @Output() trackingChanged = new EventEmitter<DeliveryTracking>();

  readonly labels = DELIVERY_LABELS;
  readonly today = todayInLima();
  readonly titles: Record<EditMode, string> = {
    create: 'Agregar seguimiento de entrega', reschedule: 'Reprogramar entrega',
    receive: 'Registrar recepción', correct: 'Corregir fechas registradas',
  };
  private readonly service = inject(DeliveryTrackingService);
  private readonly fb = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();
  private readonly cancel$ = new Subject<void>();
  readonly form = this.fb.group({
    handed_over_on: [''], expected_on: [''], received_on: [''], reason: ['', Validators.maxLength(2000)],
  });
  mode: EditMode | null = null;
  saving = false;
  error = '';
  feedback = '';
  historyError = '';
  historyOpen = false;
  historyLoading = false;
  events: DeliveryEvent[] = [];
  historyPage = 0;
  hasMore = false;

  ngOnChanges(changes: SimpleChanges): void {
    const previous = changes['tracking']?.previousValue as DeliveryTracking | null | undefined;
    if (changes['ownerId'] || changes['ownerType'] || (changes['tracking'] && previous?.id !== this.tracking?.id)) {
      this.cancel$.next();
      this.mode = null;
      this.events = [];
      this.historyPage = 0;
      this.historyOpen = this.historyAlwaysVisible && !!this.tracking;
      this.historyError = '';
      this.hasMore = false;
      this.error = '';
      this.feedback = '';
    }
    if (changes['historyAlwaysVisible']) this.historyOpen = this.historyAlwaysVisible && !!this.tracking;
    if (this.historyAlwaysVisible && this.tracking && !this.historyPage && !this.historyLoading) {
      this.historyOpen = true;
      this.loadHistory();
    }
  }

  begin(mode: EditMode): void {
    this.mode = mode;
    this.error = '';
    this.feedback = '';
    this.form.reset({
      handed_over_on: this.tracking?.handed_over_on ?? (mode === 'create' ? this.today : ''), expected_on: this.tracking?.expected_on ?? '',
      received_on: this.tracking?.received_on ?? (mode === 'receive' ? this.today : ''), reason: '',
    });
    this.form.controls.expected_on.setValidators(mode === 'create' || mode === 'reschedule' ? Validators.required : []);
    this.form.controls.received_on.setValidators(mode === 'receive' ? Validators.required : []);
    this.form.controls.reason.setValidators(mode === 'reschedule' || mode === 'correct' ? [Validators.required, Validators.maxLength(2000)] : [Validators.maxLength(2000)]);
    Object.values(this.form.controls).forEach(control => control.updateValueAndValidity());
  }

  saveEmbedded(): void { if (this.embedded) this.save(); }
  editorKeydown(event: Event): void {
    if (!(event instanceof KeyboardEvent) || !this.embedded || !(event.target instanceof HTMLInputElement) || event.isComposing) return;
    event.preventDefault();
    event.stopPropagation();
    this.save();
  }

  save(): void {
    if (!this.mode || this.saving) { return; }
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.getRawValue();
    const dates: DeliveryDates = { reason: value.reason?.trim() || undefined };
    if (this.mode === 'create' || this.mode === 'correct') { dates.handed_over_on = value.handed_over_on || null; }
    if (this.mode === 'create' || this.mode === 'reschedule') { dates.expected_on = value.expected_on!; }
    if (this.mode === 'receive' || this.mode === 'correct') { dates.received_on = value.received_on || null; }
    this.saving = true;
    this.error = '';
    const request = this.tracking
      ? this.service.updateTracking(this.tracking.id, { ...dates, revision: this.tracking.revision })
      : this.service.createForOwner(this.ownerType, this.ownerId, dates);
    request.pipe(takeUntil(this.destroy$), takeUntil(this.cancel$), finalize(() => this.saving = false)).subscribe({
      next: ({ data }) => {
        this.tracking = data;
        this.mode = null;
        this.feedback = 'Seguimiento guardado.';
        this.events = [];
        this.historyPage = 0;
        this.trackingChanged.emit(data);
        if (this.historyAlwaysVisible) this.historyOpen = true;
        if (this.historyOpen) { this.loadHistory(); }
      },
      error: (response: HttpErrorResponse) => {
        const errors = response.error?.errors as Record<string, string[]> | undefined;
        this.error = errors ? Object.values(errors).flat().join(' ') : 'No se pudo guardar. Conservamos tus datos para reintentar.';
      },
    });
  }

  toggleHistory(): void {
    if (this.historyAlwaysVisible) return;
    this.historyOpen = !this.historyOpen;
    if (this.historyOpen && !this.historyPage) { this.loadHistory(); }
  }

  loadHistory(): void {
    if (!this.tracking || this.historyLoading) { return; }
    this.historyLoading = true;
    this.historyError = '';
    this.service.history(this.tracking.id, this.historyPage + 1)
      .pipe(takeUntil(this.destroy$), takeUntil(this.cancel$), finalize(() => this.historyLoading = false)).subscribe({
        next: response => {
          this.events = [...this.events, ...response.data];
          this.historyPage++;
          this.hasMore = !!response.next_page_url;
        },
        error: () => this.historyError = 'No se pudo cargar el historial.',
      });
  }

  reload(): void {
    if (!this.tracking || this.saving) { return; }
    this.saving = true;
    this.service.getTracking(this.tracking.id).pipe(takeUntil(this.destroy$), finalize(() => this.saving = false)).subscribe({
      next: ({ data }) => {
        this.tracking = data;
        this.trackingChanged.emit(data);
        this.mode = null;
        this.error = '';
        this.events = [];
        this.historyPage = 0;
        if (this.historyOpen) { this.loadHistory(); }
      },
      error: () => this.error = 'No se pudieron recargar las fechas.',
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.cancel$.complete();
  }
}
