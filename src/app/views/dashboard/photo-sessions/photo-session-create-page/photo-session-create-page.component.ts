import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { PhotoSectionHeaderComponent } from '../shared/photo-section-header.component';
import { PhotoSessionCreateComponent } from '../photo-session-create/photo-session-create.component';
import { PhotoSessionService } from '../photo-session.service';
import { PhotoSessionOptions, PhotoSessionPayload, photoSessionError } from '../photo-session.model';

@Component({
  selector: 'app-photo-session-create-page',
  imports: [PhotoSectionHeaderComponent, RouterLink, PhotoSessionCreateComponent],
  templateUrl: './photo-session-create-page.component.html', styleUrl: '../photo-session.scss',
})
export class PhotoSessionCreatePageComponent implements OnInit {
  private readonly service = inject(PhotoSessionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  options: PhotoSessionOptions | null = null;
  loading = false; saving = false; error = '';
  ngOnInit(): void { this.load(); }
  load(): void {
    this.loading = true; this.error = '';
    this.service.options().pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading = false)).subscribe({ next: result => this.options = result.data, error: error => this.error = photoSessionError(error) });
  }
  save(payload: PhotoSessionPayload): void {
    if (this.saving) return;
    this.saving = true; this.error = '';
    this.service.create(payload).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving = false)).subscribe({
      next: result => void this.router.navigate(['../', result.data.id], { relativeTo: this.route }), error: error => this.error = photoSessionError(error),
    });
  }
}
