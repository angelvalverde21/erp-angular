import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PhotoSessionCreateComponent } from '../photo-session-create/photo-session-create.component';
import { PhotoSession, PhotoSessionOptions, PhotoSessionPayload } from '../photo-session.model';

@Component({
  selector: 'app-photo-session-edit', imports: [PhotoSessionCreateComponent],
  template: `<app-photo-session-create [session]="session" [options]="options" [editing]="true" [saving]="saving" (save)="save.emit($event)" />`,
})
export class PhotoSessionEditComponent {
  @Input({ required: true }) session!: PhotoSession;
  @Input() options: PhotoSessionOptions | null = null;
  @Input() saving = false;
  @Output() save = new EventEmitter<PhotoSessionPayload>();
}
