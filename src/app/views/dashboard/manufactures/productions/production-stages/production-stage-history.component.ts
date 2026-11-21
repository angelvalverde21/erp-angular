import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProductionStage, STAGE_STATUS } from './production-stage.service';

interface HistoryEntry {
  key: string;
  date: string;
  title: string;
  actor: string;
  automatic: boolean;
  details: string;
  changes: { label: string; before: string; after: string }[];
}

@Component({
  selector: 'app-production-stage-history',
  imports: [DatePipe],
  template: `
    <section class="history-panel" aria-labelledby="section-history-heading">
      <header><h3 id="section-history-heading">Historial de {{ stage?.name }}</h3><p>Cambios del proceso y creación de las compras actualmente asociadas, del más reciente al más antiguo.</p></header>
      @if (entries.length) {
        <ol class="work-timeline">
          @for (entry of entries; track entry.key) {
            <li><span class="timeline-dot" [class.automatic]="entry.automatic" aria-hidden="true"></span>
              <article><div class="timeline-heading"><h4>{{ entry.title }}</h4><time [attr.datetime]="entry.date">{{ entry.date | date:'dd MMM yyyy, HH:mm':'-0500':'es-PE' }}</time></div>
                @if (entry.actor) { <p class="timeline-actor">{{ entry.actor }}</p> }
                @if (entry.details) { <p>{{ entry.details }}</p> }
                @if (entry.changes.length) { <dl>@for (change of entry.changes; track $index) { <div><dt>{{ change.label }}</dt><dd><span class="previous-value">{{ change.before }}</span><i class="fa-solid fa-arrow-right" aria-label="cambió a"></i><span>{{ change.after }}</span></dd></div> }</dl> }
              </article>
            </li>
          }
        </ol>
      } @else {
        <div class="history-empty"><i class="fa-regular fa-clock" aria-hidden="true"></i><h4>Aún no hay movimientos registrados</h4><p>Los cambios guardados en esta sección aparecerán aquí.</p></div>
      }
    </section>
  `,
  styles: `
    .history-panel { padding:1.5rem; border:1px solid var(--cui-border-color,#dce2ea); border-radius:14px; background:var(--cui-body-bg,#fff); }
    header h3 { margin:0; font-size: 18px; } header p,.timeline-actor { color:var(--cui-secondary-color,#64748b); font-size: 14px; line-height:1.6; }
    .work-timeline { list-style:none; padding:0; margin:1.75rem 0 0; }
    li { position:relative; padding:0 0 1.75rem 1.75rem; margin-left:.3rem; border-left:2px solid var(--cui-border-color,#dce2ea); } li:last-child { border-color:transparent; padding-bottom:0; }
    .timeline-dot { position:absolute; top:.25rem; left:-6px; width:10px; height:10px; border-radius:50%; background:#7853cd; box-shadow:0 0 0 4px var(--cui-body-bg,#fff); } .timeline-dot.automatic { background:#8794a8; }
    .timeline-heading { display:flex; justify-content:space-between; gap:.75rem; flex-wrap:wrap; } h4 { font-size: 16px; margin:0; } time { font-size: 13px; color:var(--cui-secondary-color,#64748b); } article p { margin:.4rem 0; font-size: 14px; line-height:1.6; }
    dl { margin:.75rem 0 0; padding:.75rem 1rem; background:var(--cui-tertiary-bg,#f5f6fa); border-radius:8px; }
    dl > div { display:grid; grid-template-columns:minmax(100px,160px) minmax(0,1fr); gap:.5rem; padding:.35rem 0; font-size: 14px; line-height:1.5; } dt { font-weight:500; } dd { display:flex; align-items:baseline; flex-wrap:wrap; gap:.6rem; margin:0; overflow-wrap:anywhere; white-space:pre-wrap; } dd i { font-size:.6rem; color:#8794a8; } .previous-value { color:var(--cui-secondary-color,#64748b); }
    .history-empty { text-align:center; padding:2.5rem 1rem; color:var(--cui-secondary-color,#64748b); } .history-empty > i { font-size:1.5rem; margin-bottom:1rem; } .history-empty p { margin:.6rem 0 0; font-size: 14px; }
    @media(max-width:575.98px) { .history-panel { padding:1rem; } dl > div { grid-template-columns:1fr; } .timeline-heading { flex-direction:column; gap:.3rem; } }
  `,
})
export class ProductionStageHistoryComponent {
  private currentStage: ProductionStage | null = null;
  private currentPurchases: any[] = [];
  entries: HistoryEntry[] = [];

  @Input() set stage(value: ProductionStage | null) { this.currentStage = value; this.build(); }
  get stage(): ProductionStage | null { return this.currentStage; }
  @Input() set purchases(value: any[]) { this.currentPurchases = value ?? []; this.build(); }

  private readonly fields: Record<string, string> = {
    status: 'Estado', responsible: 'Responsable', expected_end: 'Entrega acordada', completed_at: 'Fecha de finalización',
    notes: 'Observaciones', sample_quantity: 'Cantidad de muestras', sample_details: 'Detalles de muestras',
    sample_photos: 'Fotos de muestras', sample_review: 'Revisión de muestras', review_notes: 'Comentarios de revisión',
    reuses_mold: 'Reutilizar molde', is_enabled: 'Sección incluida', date_change_reason: 'Motivo del cambio de fecha',
  };

  private value(field: string, value: unknown): string {
    if (value == null || value === '') return 'Sin definir';
    if (typeof value === 'boolean') return value ? 'Sí' : 'No';
    if (Array.isArray(value)) return value.length ? value.map(item => String(item)).join('\n') : 'Sin registros';
    if (field === 'status') return STAGE_STATUS[String(value)] ?? String(value);
    if (field === 'sample_review') return ({ pending: 'Pendiente', approved: 'Aprobadas', changes_requested: 'Necesita correcciones' } as Record<string,string>)[String(value)] ?? String(value);
    if (['expected_end','completed_at'].includes(field)) {
      const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(String(value)) ? `${value}T12:00:00Z` : String(value));
      if (!Number.isNaN(date.valueOf())) return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeZone: 'America/Lima' }).format(date);
    }
    return typeof value === 'object' ? 'Información actualizada' : String(value);
  }

  private build(): void {
    const stage = this.currentStage;
    if (!stage) { this.entries = []; return; }
    const entries: HistoryEntry[] = (stage.events ?? []).filter(event => Number.isFinite(Date.parse(event.created_at))).map(event => {
      const changes = event.changes ?? {};
      const automatic = !!changes['automatic_reason'];
      const status = changes['status'];
      let title = 'Datos del proceso actualizados';
      if (automatic) title = 'Avance actualizado por compras';
      else if (changes['is_enabled']) title = changes['is_enabled'].after ? 'Sección incluida' : 'Sección retirada';
      else if (status?.after === 'completed') title = 'Proceso completado';
      else if (status?.before === 'completed') title = 'Proceso reabierto';
      else if (status?.after === 'in_progress') title = 'Proceso en curso';
      else if (changes['sample_review']?.after === 'approved') title = 'Muestras aprobadas';
      else if (changes['expected_end']) title = 'Fecha de entrega actualizada';
      else if (changes['responsible']) title = 'Responsable actualizado';
      return {
        key: `event-${event.id}`, date: event.created_at, title, automatic,
        actor: event.user?.name ?? (automatic ? 'Actualización automática' : 'Responsable no disponible'),
        details: automatic ? String(changes['automatic_reason'].after ?? '') : '',
        changes: Object.entries(changes).filter(([field]) => this.fields[field]).map(([field, change]) => ({ label: this.fields[field], before: this.value(field, change.before), after: this.value(field, change.after) })),
      };
    });
    for (const purchase of this.currentPurchases) {
      if (Number(purchase.production_stage_id) !== stage.id || !Number.isFinite(Date.parse(purchase.created_at))) continue;
      entries.push({ key: `purchase-${purchase.id}`, date: purchase.created_at, title: `Compra #${purchase.id} creada`, actor: '', automatic: false, details: 'Actualmente asociada a esta sección.', changes: [] });
    }
    this.entries = entries.sort((a,b) => Date.parse(b.date) - Date.parse(a.date) || b.key.localeCompare(a.key));
  }
}
