import { PhotoSectionHeaderComponent } from '../../shared/photo-section-header.component';
import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { PhotoContactService } from '../photo-contact.service';
import { PhotoContactCreateComponent } from '../photo-contact-create/photo-contact-create.component';
import { PHOTO_CONTACT_LABELS, PhotoContactKind, PhotoContactPayload } from '../photo-contact.model';
import { photoSessionError } from '../../photo-session.model';

@Component({ selector: 'app-photo-contact-create-page', imports: [PhotoSectionHeaderComponent, RouterLink, PhotoContactCreateComponent], styleUrl: '../../photo-session.scss',
  template: `<main class="photo-page" [attr.data-section]="kind"><a class="back-link" routerLink="../"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i>{{ labels.title }}</a>
    <app-photo-section-header [section]="kind"><div><span class="eyebrow">SESIONES FOTOGRÁFICAS · DIRECTORIO</span><h1>Registrar {{ labels.singular }}</h1><p>Guarda su ficha para utilizarla en las sesiones.</p></div></app-photo-section-header>
    @if (error) { <div class="error" role="alert">{{ error }}</div> }
    <app-photo-contact-create [kind]="kind" [saving]="saving" (save)="save($event)" />
  </main>` })
export class PhotoContactCreatePageComponent {
  private readonly service = inject(PhotoContactService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly kind = this.route.snapshot.data['contactKind'] as PhotoContactKind;
  readonly labels = PHOTO_CONTACT_LABELS[this.kind];
  saving = false; error = '';
  save(payload: PhotoContactPayload): void {
    if (this.saving) return; this.saving = true; this.error = '';
    this.service.create(payload).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving = false)).subscribe({ next: result => void this.router.navigate(['../', result.data.id], { relativeTo: this.route }), error: error => this.error = photoSessionError(error) });
  }
}
