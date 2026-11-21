import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PhotoSessionTaskCreateComponent } from '../photo-session-task-create/photo-session-task-create.component';
import { PhotoTask, PhotoTaskPlanning } from '../photo-session-task.model';

@Component({ selector: 'app-photo-session-task-edit', imports: [PhotoSessionTaskCreateComponent],
  template: `<app-photo-session-task-create [task]="task" [assignees]="assignees" [saving]="saving" (save)="save.emit($event)" (cancel)="cancel.emit()" />` })
export class PhotoSessionTaskEditComponent {
  @Input({ required: true }) task!: PhotoTask;
  @Input() assignees: { id: number; name: string }[] = [];
  @Input() saving = false;
  @Output() save = new EventEmitter<PhotoTaskPlanning>();
  @Output() cancel = new EventEmitter<void>();
}
