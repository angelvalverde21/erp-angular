import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PhotoContactCreateComponent } from '../../contacts/photo-contact-create/photo-contact-create.component';
import { PhotoContactPayload } from '../../contacts/photo-contact.model';
import { PhotoLocationCreateComponent } from '../../locations/photo-location-create/photo-location-create.component';
import { PhotoLocationPayload } from '../../locations/photo-location.model';
import { PhotoDialogComponent } from '../photo-dialog/photo-dialog.component';

export type PhotoRelatedKind = 'photographer' | 'model' | 'location';

@Component({ selector: 'app-photo-related-create-dialog', imports: [PhotoContactCreateComponent, PhotoLocationCreateComponent, PhotoDialogComponent],
  templateUrl: './photo-related-create-dialog.component.html', styleUrl: '../../photo-session.scss' })
export class PhotoRelatedCreateDialogComponent {
  @Input({ required: true }) kind!: PhotoRelatedKind;
  @Input() saving = false;
  @Input() error = '';
  @Output() contactSave = new EventEmitter<PhotoContactPayload>();
  @Output() locationSave = new EventEmitter<PhotoLocationPayload>();
  @Output() cancel = new EventEmitter<void>();
  @ViewChild(PhotoDialogComponent) private modal?: PhotoDialogComponent;
  get isClosing(): boolean { return this.modal?.isClosing || false; }
  get title(): string { return this.kind === 'location' ? 'Nueva locación' : this.kind === 'model' ? 'Registrar modelo' : 'Registrar fotógrafo'; }
  get icon(): string { return this.kind === 'location' ? 'fa-location-dot' : this.kind === 'model' ? 'fa-user' : 'fa-camera'; }
  closeAnimated(): Promise<void> { return this.modal?.closeAnimated() || Promise.resolve(); }
  requestClose(): void { this.modal?.requestClose(); }
}
