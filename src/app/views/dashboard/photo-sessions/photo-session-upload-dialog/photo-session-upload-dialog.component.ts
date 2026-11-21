import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PhotoDialogComponent } from '../shared/photo-dialog/photo-dialog.component';
import { PhotoSessionUploadComponent } from '../photo-session-upload/photo-session-upload.component';

@Component({ selector: 'app-photo-session-upload-dialog', imports: [PhotoDialogComponent, PhotoSessionUploadComponent],
  templateUrl: './photo-session-upload-dialog.component.html',
  styleUrls: ['../photo-session.scss', './photo-session-upload-dialog.component.scss'],
})
export class PhotoSessionUploadDialogComponent {
  @Input({ required: true }) sessionId!: number;
  @Input() configured = false;
  @Input() maxBytes = 100 * 1024 ** 3;
  @Output() completed = new EventEmitter<void>();
  @Output() uploading = new EventEmitter<boolean>();
  @ViewChild(PhotoDialogComponent) private modal?: PhotoDialogComponent;
  @ViewChild(PhotoSessionUploadComponent) private queue?: PhotoSessionUploadComponent;
  busy = false;
  open(): void { this.modal?.open(); }
  close(): void { this.modal?.requestClose(); }
  progressChanged(busy: boolean): void {
    this.busy = busy; this.uploading.emit(busy);
    if (!busy && !this.queue?.error && this.queue?.tasks.length && this.queue.tasks.every(task => task.state === 'ready')) void this.modal?.closeAnimated();
  }
}
