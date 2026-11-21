import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PhotoLocation, PhotoLocationPayload } from '../photo-location.model';
import { PhotoLocationCreateComponent } from '../photo-location-create/photo-location-create.component';

@Component({ selector: 'app-photo-location-edit', imports: [PhotoLocationCreateComponent],
  template: `<app-photo-location-create [location]="location" [editing]="true" [saving]="saving" (save)="save.emit($event)" />` })
export class PhotoLocationEditComponent {
  @Input({ required: true }) location!: PhotoLocation;
  @Input() saving = false;
  @Output() save = new EventEmitter<PhotoLocationPayload>();
}
