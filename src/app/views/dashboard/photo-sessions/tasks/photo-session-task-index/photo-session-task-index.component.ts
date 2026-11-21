import { Component, DestroyRef, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { PhotoSessionTaskService } from '../photo-session-task.service';
import { PhotoTask, PhotoTaskEvent, PhotoTaskPage, PhotoTaskPlanning, PhotoTaskStatus, PhotoTaskSummary, PhotoTaskSummaryState, PHOTO_TASK_STATUSES } from '../photo-session-task.model';
import { PhotoSessionTaskCreateComponent } from '../photo-session-task-create/photo-session-task-create.component';
import { PhotoSessionTaskEditComponent } from '../photo-session-task-edit/photo-session-task-edit.component';
import { photoSessionError } from '../../photo-session.model';

@Component({
  selector: 'app-photo-session-task-index', imports: [DatePipe, FormsModule, PhotoSessionTaskCreateComponent, PhotoSessionTaskEditComponent],
  templateUrl: './photo-session-task-index.component.html',
  styleUrls: ['../../photo-session.scss', './photo-session-task-index.component.scss'],
})
export class PhotoSessionTaskIndexComponent implements OnChanges {
  @Input() sessionId: number | null = null;
  @Output() summaryChange = new EventEmitter<PhotoTaskSummary>(true);
  @Output() summaryStateChange = new EventEmitter<PhotoTaskSummaryState>(true);
  private readonly service = inject(PhotoSessionTaskService);
  private readonly destroyRef = inject(DestroyRef);
  readonly statuses = PHOTO_TASK_STATUSES;
  data: PhotoTaskPage | null = null;
  loading = false; saving = false; error = ''; actionError = ''; filter = 'all'; creating = false;
  editingTask: PhotoTask | null = null; statusTask: PhotoTask | null = null;
  nextStatus: PhotoTaskStatus = 'pending'; note = '';
  openHistory: number | null = null; loadingHistory: number | null = null;
  history: Record<number, PhotoTaskEvent[]> = {};

  ngOnChanges(): void { this.load(); }
  load(page = 1): void {
    if (!this.sessionId) return;
    if (this.loading) return;
    this.loading = true; this.error = '';
    this.summaryStateChange.emit({ loading: true, error: '' });
    const params: Record<string, string> = { status: this.filter, page: String(page) };
    if (this.sessionId) params['photo_session_id'] = String(this.sessionId);
    this.service.list(params).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => {
      this.loading = false; this.summaryStateChange.emit({ loading: false, error: this.error });
    })).subscribe({
      next: data => { this.data = data; this.summaryChange.emit(data.summary); }, error: error => this.error = photoSessionError(error),
    });
  }
  create(): void { this.creating = true; this.editingTask = null; this.statusTask = null; this.actionError = ''; }
  edit(task: PhotoTask): void { this.editingTask = task; this.creating = false; this.statusTask = null; this.actionError = ''; }
  savePlanning(payload: PhotoTaskPlanning): void {
    if (this.saving || !this.sessionId) return;
    this.saving = true; this.actionError = '';
    const request = this.editingTask ? this.service.editTask(this.editingTask, payload) : this.service.createTask(this.sessionId, payload);
    request.pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving = false)).subscribe({
      next: result => { this.creating = false; this.editingTask = null; delete this.history[result.data.id]; this.filter = 'all'; this.load(); },
      error: error => this.handleActionError(error),
    });
  }
  changeStatus(task: PhotoTask): void {
    this.statusTask = task; this.nextStatus = task.status; this.note = ''; this.actionError = ''; this.creating = false; this.editingTask = null;
  }
  saveStatus(): void {
    if (this.saving || !this.statusTask || (this.nextStatus === 'blocked' && !this.note.trim())) return;
    this.saving = true; this.actionError = '';
    this.service.changeStatus(this.statusTask, this.nextStatus, this.note.trim() || null).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving = false)).subscribe({
      next: result => { this.statusTask = null; delete this.history[result.data.id]; this.load(this.data?.current_page || 1); },
      error: error => this.handleActionError(error),
    });
  }
  toggleHistory(task: PhotoTask): void {
    this.openHistory = this.openHistory === task.id ? null : task.id;
    if (this.openHistory === null || this.history[task.id]) return;
    this.loadingHistory = task.id;
    this.service.events(task.id).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loadingHistory = null)).subscribe({
      next: result => this.history[task.id] = result.data,
      error: error => { this.openHistory = null; this.actionError = photoSessionError(error); },
    });
  }
  statusLabel(status: string): string { return this.statuses.find(option => option.value === status)?.label || status; }
  eventDescription(event: PhotoTaskEvent): string {
    if (event.type === 'created') return 'Tarea creada y asignada';
    if (event.type === 'status_changed') return `${this.statusLabel(String(event.changes.before?.['status']))} → ${this.statusLabel(String(event.changes.after?.['status']))}`;
    const labels: Record<string, string> = { title: 'Tarea', description: 'Instrucciones', assigned_to: 'Responsable', due_date: 'Fecha límite' };
    return Object.entries(event.changes.after || {}).filter(([key, value]) => value !== event.changes.before?.[key])
      .map(([key, value]) => `${labels[key] || key}: ${this.eventValue(key, event.changes.before?.[key])} → ${this.eventValue(key, value)}`).join('\n');
  }
  private eventValue(key: string, value: unknown): string {
    if (value === null || value === undefined || value === '') return 'Sin definir';
    if (key === 'assigned_to') return this.data?.assignees.find(employee => employee.id === Number(value))?.name || `Empleado #${value}`;
    return String(value);
  }
  private handleActionError(error: { status?: number }): void {
    this.actionError = photoSessionError(error);
    if (error.status === 409) { this.editingTask = null; this.statusTask = null; this.load(this.data?.current_page || 1); }
  }
}
