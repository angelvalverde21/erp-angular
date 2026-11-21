import { PhotoSectionHeaderComponent } from '../../shared/photo-section-header.component';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, EMPTY, finalize, startWith, Subject, switchMap } from 'rxjs';
import { PhotoContactService } from '../photo-contact.service';
import { PhotoContact, PhotoContactKind, PHOTO_CONTACT_LABELS } from '../photo-contact.model';
import { PhotoContactIndexComponent } from '../photo-contact-index/photo-contact-index.component';
import { PhotoPage, photoSessionError } from '../../photo-session.model';

@Component({ selector: 'app-photo-contact-index-page', imports: [PhotoSectionHeaderComponent, RouterLink, FormsModule, PhotoContactIndexComponent],
  templateUrl: './photo-contact-index-page.component.html', styleUrls: ['../../photo-session.scss', './photo-contact-index-page.component.scss'] })
export class PhotoContactIndexPageComponent implements OnInit {
  private readonly service = inject(PhotoContactService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly refresh$ = new Subject<void>();
  readonly kind = this.route.snapshot.data['contactKind'] as PhotoContactKind;
  readonly labels = PHOTO_CONTACT_LABELS[this.kind];
  data: PhotoPage<PhotoContact> | null = null;
  search = ''; active = 'all'; loading = false; error = ''; query: Record<string, string> = {};
  ngOnInit(): void {
    combineLatest([this.route.queryParamMap, this.refresh$.pipe(startWith(undefined))]).pipe(switchMap(([params]) => {
      this.query = {}; for (const key of ['q', 'active', 'page']) if (params.get(key)) this.query[key] = params.get(key)!;
      this.search = this.query['q'] || ''; this.active = this.query['active'] || 'all'; this.loading = true; this.error = '';
      return this.service.list(this.kind, this.query).pipe(catchError(error => { this.data = null; this.error = photoSessionError(error); return EMPTY; }), finalize(() => this.loading = false));
    }), takeUntilDestroyed(this.destroyRef)).subscribe(data => this.data = data);
  }
  filter(): void { this.navigate({ q: this.search.trim() || null, active: this.active, page: '1' }); }
  retry(): void { this.refresh$.next(); }
  page(page: number): void { if (!this.loading && this.data && page >= 1 && page <= this.data.last_page) this.navigate({ page: String(page) }); }
  private navigate(params: Record<string, string | null>): void { void this.router.navigate([], { relativeTo: this.route, queryParams: { ...this.query, ...params } }); }
}
