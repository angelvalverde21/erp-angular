import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductionProgress } from '../dashboard.model';

@Component({
  selector: 'app-production-progress',
  imports: [DatePipe, DecimalPipe, RouterLink],
  templateUrl: './production-progress.component.html',
  styleUrl: './production-progress.component.scss',
})
export class ProductionProgressComponent {
  @Input({ required: true }) summary!: ProductionProgress;
  @Input() store = '';
  readonly labels = {
    unplanned: 'Sin meta',
    pending: 'Pendiente',
    in_progress: 'En progreso',
    completed: 'Completada',
  };

  link(path = 'manufactures/productions'): string[] {
    return ['/', this.store, 'dashboard', ...path.split('/')];
  }
}
