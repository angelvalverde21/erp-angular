import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PhotoSessionSection } from '../photo-session-workspace.model';
import { PhotoTaskSummary, PhotoTaskSummaryState } from '../tasks/photo-session-task.model';

@Component({
  selector: 'app-photo-session-dashboard',
  templateUrl: './photo-session-dashboard.component.html',
  styleUrls: ['../photo-session.scss', './photo-session-dashboard.component.scss'],
})
export class PhotoSessionDashboardComponent {
  @Input() summary: PhotoTaskSummary | null = null;
  @Input() taskState: PhotoTaskSummaryState = { loading: true, error: '' };
  @Input() resourceCounts = { photographers: 0, models: 0, locations: 0, library: 0 };
  readonly setupSections: { key: 'photographers' | 'models' | 'locations' | 'library'; label: string; icon: string }[] = [
    { key: 'photographers', label: 'Asignar fotógrafos', icon: 'fa-camera' },
    { key: 'models', label: 'Agregar modelos', icon: 'fa-user' },
    { key: 'locations', label: 'Elegir locaciones', icon: 'fa-location-dot' },
    { key: 'library', label: 'Subir archivos', icon: 'fa-images' },
  ];
  get emptyPreparation(): boolean { return !!this.summary && this.summary.total === 0 && !this.taskState.loading && !this.taskState.error; }
  get missingSections() { return this.setupSections.filter(section => this.resourceCounts[section.key] === 0); }
  @Output() navigate = new EventEmitter<PhotoSessionSection>();

  get percentage(): number {
    return this.summary?.total ? Math.min(100, Math.max(0, Math.round(this.summary.completed / this.summary.total * 100))) : 0;
  }
}
