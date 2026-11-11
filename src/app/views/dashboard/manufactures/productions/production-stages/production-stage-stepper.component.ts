import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductionStage, STAGE_STATUS } from './production-stage.service';

@Component({
  selector: 'app-production-stage-stepper',
  template: `
    <nav class="stage-stepper" aria-label="Etapas de producción">
      @for (stage of stages; track stage.id; let index = $index) {
        <button type="button" class="stage-step" [class]="'stage-step ' + stage.status"
          [class.selected]="selectedId === stage.id" [attr.aria-current]="selectedId === stage.id ? 'step' : null"
          (click)="choose.emit(stage.id)">
          <span class="step-number" aria-hidden="true">@if (stage.status === 'completed') { <i class="fa-solid fa-check"></i> } @else if (stage.status === 'in_progress') { <i class="fa-solid fa-clock"></i> } @else { {{ index + 1 }} }</span>
          <span><strong>{{ stage.name }}</strong><small>{{ labels[stage.status] }}@if (overdue(stage)) { · Atrasada }</small></span>
        </button>
      }
    </nav>
  `,
  styleUrl: './production-stage-stepper.component.scss',
})
export class ProductionStageStepperComponent {
  @Input() stages: Pick<ProductionStage, 'id' | 'name' | 'status' | 'expected_end'>[] = [];
  @Input() selectedId = 0;
  @Output() choose = new EventEmitter<number>();
  labels = STAGE_STATUS;

  overdue(stage: Pick<ProductionStage, 'status' | 'expected_end'>): boolean {
    const now = new Date();
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
    return !!stage.expected_end && stage.expected_end < today && !['completed', 'not_applicable'].includes(stage.status);
  }
}
