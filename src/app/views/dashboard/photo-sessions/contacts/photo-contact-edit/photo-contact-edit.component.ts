import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PhotoContactCreateComponent } from '../photo-contact-create/photo-contact-create.component';
import { PhotoContact, PhotoContactKind, PhotoContactPayload } from '../photo-contact.model';

@Component({ selector: 'app-photo-contact-edit', imports: [PhotoContactCreateComponent],
  template: `<app-photo-contact-create [kind]="kind" [contact]="contact" [editing]="true" [saving]="saving" (save)="save.emit($event)" />` })
export class PhotoContactEditComponent {
  @Input({ required: true }) contact!: PhotoContact;
  @Input() kind: PhotoContactKind = 'photographer';
  @Input() saving = false;
  @Output() save = new EventEmitter<PhotoContactPayload>();
}
