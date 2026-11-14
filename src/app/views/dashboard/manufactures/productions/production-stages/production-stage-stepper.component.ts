import { Component, EventEmitter, Input, Output } from '@angular/core';
import { isProcessStage, ProductionStage, STAGE_STATUS } from './production-stage.service';
import { ProductionStageStatusComponent } from './production-stage-status.component';

type StepperStage = Pick<ProductionStage, 'id' | 'name' | 'status' | 'expected_end'> & Partial<ProductionStage>;

@Component({
  selector: 'app-production-stage-stepper',
  imports: [ProductionStageStatusComponent],
  templateUrl: './production-stage-stepper.component.html',
  styleUrl: './production-stage-stepper.component.scss',
})
export class ProductionStageStepperComponent {
  private processStages: (StepperStage & { status: string })[] = [];
  @Input() set stages(value: StepperStage[]) {
    this.processStages = value.filter(isProcessStage);
  }
  get stages(): (StepperStage & { status: string })[] { return this.processStages; }
  @Input() selectedId = 0;
  @Input() productionId = 0;
  @Input() otherExpenses: { id: number; count: number } | null = null;
  @Output() choose = new EventEmitter<number>();
  get selectedIndex(): number {
    return this.stages.findIndex(stage => stage.id === this.selectedId);
  }
  readonly labels: Readonly<Record<string, string>> = {
    ...STAGE_STATUS,
    completed: 'Completado',
  };

  readonly stageIcons: Readonly<Record<string, string>> = {
    molds: 'fa-solid fa-ruler-combined',
    samples: 'fa-solid fa-shirt',
    materials: 'fa-solid fa-layer-group',
    cutting: 'fa-solid fa-scissors',
    sewing: 'fa-solid fa-gears',
    finishing: 'fa-solid fa-wand-magic-sparkles',
  };

  readonly statusIcons: Readonly<Record<string, string>> = {
    completed: 'fa-solid fa-check',
    in_progress: 'fa-solid fa-clock',
    not_applicable: 'fa-solid fa-minus',
  };

  private readonly dateFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  overdue(stage: StepperStage): boolean {
    if (!stage.status || !stage.expected_end || ['completed', 'not_applicable'].includes(stage.status)) {
      return false;
    }

    const today = this.dateFormatter.format(new Date());
    return stage.expected_end < today;
  }
}
