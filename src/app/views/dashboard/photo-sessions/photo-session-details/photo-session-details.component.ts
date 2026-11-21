import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PHOTO_SESSION_STATUSES, PhotoSession } from '../photo-session.model';

@Component({
  selector: 'app-photo-session-details', imports: [DatePipe],
  templateUrl: './photo-session-details.component.html',
  styleUrls: ['../photo-session.scss', './photo-session-details.component.scss'],
})
export class PhotoSessionDetailsComponent {
  @Input({ required: true }) session!: PhotoSession;
  get statusLabel(): string { return PHOTO_SESSION_STATUSES.find(status => status.value === this.session.status)?.label || this.session.status; }
}
