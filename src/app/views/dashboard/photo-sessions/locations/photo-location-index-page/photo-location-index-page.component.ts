import { PhotoSectionHeaderComponent } from '../../shared/photo-section-header.component';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, EMPTY, finalize, startWith, Subject, switchMap } from 'rxjs';
import { PHOTO_LOCATION_TYPES, PhotoLocation } from '../photo-location.model';
import { PhotoLocationService } from '../photo-location.service';
import { PhotoLocationIndexComponent } from '../photo-location-index/photo-location-index.component';
import { PhotoPage, photoSessionError } from '../../photo-session.model';

@Component({ selector: 'app-photo-location-index-page', imports: [PhotoSectionHeaderComponent, FormsModule, RouterLink, PhotoLocationIndexComponent],
  templateUrl: './photo-location-index-page.component.html', styleUrls: ['../../photo-session.scss', './photo-location-index-page.component.scss'] })
export class PhotoLocationIndexPageComponent implements OnInit {
  private readonly service = inject(PhotoLocationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly refresh$ = new Subject<void>();
  readonly types = PHOTO_LOCATION_TYPES;
  data: PhotoPage<PhotoLocation> | null = null;
  query: Record<string, string> = {};
  search = ''; type = 'all'; active = 'all'; loading = false; error = '';
  ngOnInit(): void {
    combineLatest([this.route.queryParamMap, this.refresh$.pipe(startWith(undefined))]).pipe(switchMap(([params]) => {
      this.query = {}; for (const key of ['q', 'type', 'active', 'page']) if (params.get(key)) this.query[key] = params.get(key)!;
      this.search = this.query['q'] || ''; this.type = this.query['type'] || 'all'; this.active = this.query['active'] || 'all'; this.loading = true; this.error = '';
      return this.service.list(this.query).pipe(catchError(error => { this.data = null; this.error = photoSessionError(error); return EMPTY; }), finalize(() => this.loading = false));
    }), takeUntilDestroyed(this.destroyRef)).subscribe(data => this.data = data);
  }
  filter(): void { this.navigate({ q: this.search.trim() || null, type: this.type, active: this.active, page: '1' }); }
  retry(): void { this.refresh$.next(); }
  page(page: number): void { if (!this.loading && this.data && page >= 1 && page <= this.data.last_page) this.navigate({ page: String(page) }); }
  private navigate(params: Record<string, string | null>): void { void this.router.navigate([], { relativeTo: this.route, queryParams: { ...this.query, ...params } }); }
}
