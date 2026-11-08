import { Component, Input } from '@angular/core';
import { INVENTORY_STATUS_LABELS } from '../inventory-workflow';
@Component({
  selector: 'app-inventory-status',
  template: '<span class="workflow-status" [attr.data-status]="status">{{ labels[status] || status }}</span>',
  styles: ['.workflow-status { display: inline-flex; align-items: center; padding: .35rem .6rem; border-radius: .4rem; font-size: .73rem; font-weight: 600; background: var(--cui-tertiary-bg, #f1f5f9); color: var(--cui-secondary-color, #64748b); white-space: nowrap; } .workflow-status[data-status=open], .workflow-status[data-status=in_progress] { background: rgba(14, 116, 144, .1); color: var(--cui-info-text-emphasis, #0e7490); } .workflow-status[data-status=completed], .workflow-status[data-status=closed] { background: rgba(22, 101, 52, .1); color: var(--cui-success-text-emphasis, #166534); }'],
})
export class InventoryStatusComponent { @Input() status = ''; readonly labels = INVENTORY_STATUS_LABELS; }
