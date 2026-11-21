import { PhotoSectionHeaderComponent } from '../shared/photo-section-header.component';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, EMPTY, finalize, startWith, Subject, switchMap } from 'rxjs';
import { PhotoSessionService } from '../photo-session.service';
import { PHOTO_SESSION_STATUSES, PhotoPage, PhotoSession, photoSessionError } from '../photo-session.model';
import { PhotoSessionIndexComponent } from '../photo-session-index/photo-session-index.component';

@Component({
  selector: 'app-photo-session-index-page', imports: [PhotoSectionHeaderComponent, RouterLink, FormsModule, PhotoSessionIndexComponent],
  templateUrl: './photo-session-index-page.component.html', styleUrls: ['../photo-session.scss', './photo-session-index-page.component.scss'],
})
export class PhotoSessionIndexPageComponent implements OnInit {
  private readonly api = inject(PhotoSessionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly refresh$ = new Subject<void>();
  readonly statuses = PHOTO_SESSION_STATUSES;
  data: PhotoPage<PhotoSession> | null = null;
  query: Record<string, string> = {};
  search = ''; status = 'all'; loading = false; error = '';
  ngOnInit(): void {
    combineLatest([this.route.queryParamMap, this.refresh$.pipe(startWith(undefined))]).pipe(switchMap(([params]) => {
      this.query = {}; for (const key of ['q', 'status', 'page']) if (params.get(key)) this.query[key] = params.get(key)!;
      this.search = this.query['q'] || ''; this.status = this.query['status'] || 'all'; this.loading = true; this.error = '';
      return this.api.list(this.query).pipe(catchError(error => { this.data = null; this.error = photoSessionError(error); return EMPTY; }), finalize(() => this.loading = false));
    }), takeUntilDestroyed(this.destroyRef)).subscribe(data => this.data = data);
  }
  filter(): void { this.navigate({ q: this.search.trim() || null, status: this.status, page: '1' }); }
  retry(): void { this.refresh$.next(); }
  page(value: number): void { if (!this.loading && this.data && value >= 1 && value <= this.data.last_page) this.navigate({ page: String(value) }); }
  private navigate(params: Record<string, string | null>): void { void this.router.navigate([], { relativeTo: this.route, queryParams: { ...this.query, ...params } }); }
}
