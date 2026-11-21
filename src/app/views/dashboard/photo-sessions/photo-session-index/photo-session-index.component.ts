import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PhotoSession, PHOTO_SESSION_STATUSES, photoFileSize } from '../photo-session.model';

@Component({
  selector: 'app-photo-session-index', imports: [DatePipe, RouterLink], templateUrl: './photo-session-index.component.html',
  styleUrls: ['../photo-session.scss', './photo-session-index.component.scss'],
})
export class PhotoSessionIndexComponent {
  @Input() sessions: readonly PhotoSession[] = [];
  @Input() employeeView = false;
  readonly size = photoFileSize;
  locationNames(session: PhotoSession): string { return session.locations?.map(location => location.name).join(' · ') || session.photo_location?.name || session.location || ''; }
  photographerNames(session: PhotoSession): string { return session.photographers?.map(contact => contact.name).join(' · ') || session.photographer_contact?.name || session.photographer || ''; }
  status(value: string): string { return PHOTO_SESSION_STATUSES.find(status => status.value === value)?.label || value; }
}
