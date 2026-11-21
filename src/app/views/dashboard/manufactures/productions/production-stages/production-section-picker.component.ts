import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface ProductionSectionOption {
  id: number;
  code: string;
  name: string;
  is_enabled?: boolean;
  purchases_count?: number;
}

@Component({
  selector: 'app-production-section-picker',
  standalone: true,
  template: `
    <div class="section-picker" role="group" aria-label="Secciones de esta producción">
      @for (option of options; track option.id) {
        <label class="section-choice" [class.selected]="selectedIds.includes(option.id)" [class.unavailable]="isLocked(option)">
          <input type="checkbox" [checked]="selectedIds.includes(option.id)" [disabled]="disabled || isLocked(option)" (change)="toggle(option, $any($event.target).checked)">
          <span><strong>{{ option.name }}</strong>
            @if (option.purchases_count) { <small>{{ option.purchases_count }} compras · Reasígnalas antes de quitar esta sección.</small> }
          </span>
        </label>
      }
    </div>
    <p class="selection-count">{{ selectedIds.length }} de {{ options.length }} secciones seleccionadas</p>
  `,
  styles: `
    .section-picker { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: .6rem; }
    .section-choice { display: flex; align-items: flex-start; gap: .6rem; padding: .9rem; border: 1px solid var(--cui-border-color,#dce2ea); border-radius: 9px; cursor: pointer; background: var(--cui-body-bg,#fff); }
    .section-choice.selected { border-color: #a38bd4; background: color-mix(in srgb,#6941c6 5%,var(--cui-body-bg,#fff)); }
    input { margin-top: .2rem; width: 17px; height: 17px; flex-shrink: 0; accent-color: #6941c6; }
    strong { font-size: .8rem; font-weight: 600; } small { display: block; font-size: .7rem; margin-top: .3rem; color: var(--cui-secondary-color,#64748b); }
    .unavailable { cursor: default; } .selection-count { font-size: .75rem; color: var(--cui-secondary-color,#64748b); margin: .7rem 0 0; }
    @media(max-width:767.98px) { .section-picker { grid-template-columns: repeat(2,minmax(0,1fr)); } }
  `,
})
export class ProductionSectionPickerComponent {
  @Input() options: ProductionSectionOption[] = [];
  @Input() selectedIds: number[] = [];
  @Input() disabled = false;
  @Output() selectedIdsChange = new EventEmitter<number[]>();

  isLocked(option: ProductionSectionOption): boolean {
    return !!option.purchases_count && this.selectedIds.includes(option.id);
  }

  toggle(option: ProductionSectionOption, checked: boolean): void {
    if (this.disabled || this.isLocked(option)) return;
    const selection = new Set(this.selectedIds);
    checked ? selection.add(option.id) : selection.delete(option.id);
    this.selectedIdsChange.emit([...selection]);
  }
}
