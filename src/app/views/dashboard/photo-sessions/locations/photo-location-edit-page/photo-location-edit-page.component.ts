import { PhotoSectionHeaderComponent } from '../../shared/photo-section-header.component';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, EMPTY, finalize, startWith, Subject, switchMap } from 'rxjs';
import { PhotoLocationEditComponent } from '../photo-location-edit/photo-location-edit.component';
import { PhotoLocationService } from '../photo-location.service';
import { PhotoLocation, PhotoLocationPayload } from '../photo-location.model';
import { photoSessionError } from '../../photo-session.model';

@Component({ selector: 'app-photo-location-edit-page', imports: [PhotoSectionHeaderComponent, RouterLink, PhotoLocationEditComponent], styleUrl: '../../photo-session.scss',
  template: `<main class="photo-page" data-section="locations"><a class="back-link" routerLink="../"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i>Locaciones</a>
    <app-photo-section-header section="locations"><div><span class="eyebrow">SESIONES FOTOGRÁFICAS · ESPACIOS</span><h1>{{ location?.name || 'Editar locación' }}</h1><p>Actualiza el espacio, sus condiciones y los datos de contacto.</p></div></app-photo-section-header>
    @if (error) { <div class="error" role="alert">{{ error }}@if (!location) { <button class="button" (click)="retry()">Reintentar</button> }</div> }
    @if (saved) { <div class="notice" role="status">Locación actualizada.</div> }
    @if (loading) { <div class="panel feedback" role="status">Cargando locación…</div> }
    @else if (location) { <app-photo-location-edit [location]="location" [saving]="saving" (save)="save($event)" /> }
  </main>` })
export class PhotoLocationEditPageComponent implements OnInit {
  private readonly service = inject(PhotoLocationService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly refresh$ = new Subject<void>();
  location: PhotoLocation | null = null;
  loading = false; saving = false; saved = false; error = '';
  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.refresh$.pipe(startWith(undefined))]).pipe(switchMap(([params]) => {
      this.loading = true; this.error = '';
      return this.service.show(Number(params.get('photo_location_id'))).pipe(catchError(error => { this.location = null; this.error = photoSessionError(error); return EMPTY; }), finalize(() => this.loading = false));
    }), takeUntilDestroyed(this.destroyRef)).subscribe(result => this.location = result.data);
  }
  retry(): void { this.refresh$.next(); }
  save(payload: PhotoLocationPayload): void {
    if (this.saving || !this.location) return; this.saving = true; this.saved = false; this.error = '';
    this.service.saveChanges(this.location.id, payload).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving = false)).subscribe({ next: result => { this.location = result.data; this.saved = true; }, error: error => this.error = photoSessionError(error) });
  }
}
