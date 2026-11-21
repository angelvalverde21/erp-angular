import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PhotoContact, PhotoContactKind } from '../photo-contact.model';

@Component({ selector: 'app-photo-contact-index', imports: [RouterLink], templateUrl: './photo-contact-index.component.html',
  styleUrls: ['../../photo-session.scss', './photo-contact-index.component.scss'] })
export class PhotoContactIndexComponent {
  @Input() contacts: readonly PhotoContact[] = [];
  @Input() kind: PhotoContactKind = 'photographer';
}
