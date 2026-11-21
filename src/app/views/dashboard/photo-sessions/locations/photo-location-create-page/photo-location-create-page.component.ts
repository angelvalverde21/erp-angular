import { PhotoSectionHeaderComponent } from '../../shared/photo-section-header.component';
import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { PhotoLocationCreateComponent } from '../photo-location-create/photo-location-create.component';
import { PhotoLocationService } from '../photo-location.service';
import { PhotoLocationPayload } from '../photo-location.model';
import { photoSessionError } from '../../photo-session.model';

@Component({ selector: 'app-photo-location-create-page', imports: [PhotoSectionHeaderComponent, RouterLink, PhotoLocationCreateComponent], styleUrl: '../../photo-session.scss',
  template: `<main class="photo-page" data-section="locations"><a class="back-link" routerLink="../"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i>Locaciones</a>
    <app-photo-section-header section="locations"><div><span class="eyebrow">SESIONES FOTOGRÁFICAS · ESPACIOS</span><h1>Nueva locación</h1><p>Guarda los datos del lugar para tus próximas sesiones.</p></div></app-photo-section-header>
    @if (error) { <div class="error" role="alert">{{ error }}</div> }
    <app-photo-location-create [saving]="saving" (save)="save($event)" />
  </main>` })
export class PhotoLocationCreatePageComponent {
  private readonly service = inject(PhotoLocationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  saving = false; error = '';
  save(payload: PhotoLocationPayload): void {
    if (this.saving) return; this.saving = true; this.error = '';
    this.service.create(payload).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving = false)).subscribe({ next: result => void this.router.navigate(['../', result.data.id], { relativeTo: this.route }), error: error => this.error = photoSessionError(error) });
  }
}
