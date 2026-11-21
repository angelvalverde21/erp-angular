import { Component, DestroyRef, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ImagePreviewComponent } from '../../../shared/components/image-preview/image-preview.component';
import { PhotoAsset, PhotoPage, PHOTO_ASSET_CATEGORIES, photoFileSize, photoSessionError } from '../photo-session.model';
import { PhotoSessionService } from '../photo-session.service';

@Component({
  selector: 'app-photo-session-asset-index', imports: [ImagePreviewComponent], templateUrl: './photo-session-asset-index.component.html',
  styleUrls: ['../photo-session.scss', './photo-session-asset-index.component.scss'],
})
export class PhotoSessionAssetIndexComponent implements OnChanges {
  @Input({ required: true }) sessionId!: number;
  @Input() uploading = false;
  @Output() uploadRequested = new EventEmitter<void>();
  @Output() totalChange = new EventEmitter<number>(true);
  private readonly api = inject(PhotoSessionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cancel$ = new Subject<void>();
  readonly categories = PHOTO_ASSET_CATEGORIES;
  readonly size = photoFileSize;
  data: PhotoPage<PhotoAsset> | null = null;
  kind = 'all'; category = 'all'; selected = false;
  loading = false; error = '';
  saving = new Set<string>();
  ngOnChanges(changes: SimpleChanges): void { if (changes['sessionId']) this.load(); }
  refreshAfterUpload(): void { this.kind = 'all'; this.category = 'all'; this.selected = false; this.load(); }
  load(page = 1): void {
    this.cancel$.next(); this.loading = true; this.error = '';
    this.api.assets(this.sessionId, { kind: this.kind, category: this.category, selected: this.selected ? '1' : '0', page: String(page) })
      .pipe(takeUntil(this.cancel$), takeUntilDestroyed(this.destroyRef), finalize(() => this.loading = false))
      .subscribe({ next: result => {
        this.data = result;
        if (this.kind === 'all' && this.category === 'all' && !this.selected) this.totalChange.emit(result.total);
      }, error: error => { this.data = null; this.error = photoSessionError(error); } });
  }
  filter(field: 'kind' | 'category', event: Event): void { this[field] = (event.target as HTMLSelectElement).value; this.load(); }
  toggleSelected(): void { this.selected = !this.selected; this.load(); }
  selectAsset(asset: PhotoAsset): void {
    this.saving.add(asset.id);
    this.api.updateAsset(this.sessionId, asset.id, { selected: !asset.selected }).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving.delete(asset.id))).subscribe({
      next: result => { Object.assign(asset, result.data); if (this.selected && !asset.selected) this.load(); }, error: error => this.error = photoSessionError(error),
    });
  }
  download(asset: PhotoAsset): void {
    this.api.download(this.sessionId, asset.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => { const link = document.createElement('a'); link.href = result.data.url; link.rel = 'noopener'; link.download = asset.name; link.click(); }, error: error => this.error = photoSessionError(error),
    });
  }
}
