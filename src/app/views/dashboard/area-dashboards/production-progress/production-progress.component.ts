import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductionStageStepperComponent } from '../../manufactures/productions/production-stages/production-stage-stepper.component';
import { ProductionProgress } from '../dashboard.model';

@Component({
  selector: 'app-production-progress',
  imports: [DatePipe, DecimalPipe, RouterLink, ProductionStageStepperComponent],
  templateUrl: './production-progress.component.html',
  styleUrl: './production-progress.component.scss',
})
export class ProductionProgressComponent {
  constructor(private router: Router) {}

  openStage(path: string, id: number): void {
    void this.router.navigate([...this.link(path), 'purchases'], { queryParams: { stage: id } });
  }
  @Input({ required: true }) summary!: ProductionProgress;
  @Input() store = '';
  readonly labels = {
    unplanned: 'Sin meta',
    pending: 'Sin recepción',
    in_progress: 'Recepción parcial',
    completed: 'Recepción completa',
  };

  link(path = 'manufactures/productions'): string[] {
    return ['/', this.store, 'dashboard', ...path.split('/')];
  }
}
