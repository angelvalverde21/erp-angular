import { Component, Input } from '@angular/core';
import { PREPARATION_STATES, PreparationStatus } from './order-workspace.model';

@Component({
  selector: 'app-order-preparation-badge',
  template: `<span [class]="'state-badge ' + state.tone"><i [class]="'fa-solid ' + state.icon" aria-hidden="true"></i>{{ state.label }}</span>`,
  styles: `
    .state-badge { display:inline-flex; align-items:center; gap:.4rem; padding:.4rem .6rem; border-radius:6px; font-size:.73rem; font-weight:650; white-space:nowrap; }
    .success { background:#e6f4ed; color:#216e50; } .primary { background:#edf1fc; color:#4b63a8; }
    .neutral { background:#edf1f6; color:#60728b; } .warning { background:#fff2da; color:#94621e; }
    .danger { background:#fbecef; color:#a44355; }
  `,
})
export class OrderPreparationBadgeComponent {
  @Input({ required: true }) status!: PreparationStatus;
  get state() { return PREPARATION_STATES[this.status] ?? PREPARATION_STATES.review; }
}
