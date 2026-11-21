import { PhotoSectionHeaderComponent } from '../../shared/photo-section-header.component';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, EMPTY, finalize, startWith, Subject, switchMap } from 'rxjs';
import { PhotoContactEditComponent } from '../photo-contact-edit/photo-contact-edit.component';
import { PhotoContactService } from '../photo-contact.service';
import { PHOTO_CONTACT_LABELS, PhotoContact, PhotoContactKind, PhotoContactPayload } from '../photo-contact.model';
import { photoSessionError } from '../../photo-session.model';
import { PhotoModelProfileComponent } from '../photo-model-profile/photo-model-profile.component';

@Component({ selector: 'app-photo-contact-edit-page', imports: [PhotoSectionHeaderComponent, RouterLink, PhotoContactEditComponent, PhotoModelProfileComponent], styleUrl: '../../photo-session.scss',
  template: `<main class="photo-page" [attr.data-section]="kind"><a class="back-link" routerLink="../"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i>{{ labels.title }}</a>
    <app-photo-section-header [section]="kind"><div><span class="eyebrow">SESIONES FOTOGRÁFICAS · DIRECTORIO</span><h1>{{ contact?.name || 'Editar ' + labels.singular }}</h1><p>Actualiza sus datos o marca la ficha como inactiva.</p></div></app-photo-section-header>
    @if (error) { <div class="error" role="alert">{{ error }}@if (!contact) { <button class="button" (click)="retry()">Reintentar</button> }</div> }
    @if (saved) { <div class="notice" role="status">Ficha actualizada.</div> }
    @if (loading) { <div class="panel feedback" role="status">Cargando ficha…</div> }
    @else if (contact) {
      @if (kind === 'model') { <app-photo-model-profile [contact]="contact" [saving]="saving" (save)="save($event)" /> }
      @else { <app-photo-contact-edit [kind]="kind" [contact]="contact" [saving]="saving" (save)="save($event)" /> }
    }
  </main>` })
export class PhotoContactEditPageComponent implements OnInit {
  private readonly service = inject(PhotoContactService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly refresh$ = new Subject<void>();
  readonly kind = this.route.snapshot.data['contactKind'] as PhotoContactKind;
  readonly labels = PHOTO_CONTACT_LABELS[this.kind];
  contact: PhotoContact | null = null;
  loading = false; saving = false; error = ''; saved = false;
  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.refresh$.pipe(startWith(undefined))]).pipe(switchMap(([params]) => {
      this.loading = true; this.error = '';
      return this.service.show(Number(params.get('contact_id')), this.kind).pipe(catchError(error => { this.contact = null; this.error = photoSessionError(error); return EMPTY; }), finalize(() => this.loading = false));
    }), takeUntilDestroyed(this.destroyRef)).subscribe(result => this.contact = result.data);
  }
  retry(): void { this.refresh$.next(); }
  save(payload: PhotoContactPayload): void {
    if (this.saving || !this.contact) return; this.saving = true; this.error = ''; this.saved = false;
    this.service.saveChanges(this.contact.id, payload).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving = false)).subscribe({ next: result => { this.contact = result.data; this.saved = true; }, error: error => this.error = photoSessionError(error) });
  }
}
