import { Component, DestroyRef, EventEmitter, Input, Output, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ImagePreviewComponent } from '../../../../shared/components/image-preview/image-preview.component';
import { PhotoContactEditComponent } from '../photo-contact-edit/photo-contact-edit.component';
import { PhotoModelImageIndexComponent } from '../photo-model-image-index/photo-model-image-index.component';
import { PhotoContact, PhotoContactPayload, PhotoReferenceImage } from '../photo-contact.model';

type ModelTab = 'data' | 'gallery';

@Component({
  selector: 'app-photo-model-profile',
  imports: [PhotoContactEditComponent, PhotoModelImageIndexComponent, ImagePreviewComponent],
  templateUrl: './photo-model-profile.component.html',
  styleUrls: ['../../photo-session.scss', './photo-model-profile.component.scss'],
})
export class PhotoModelProfileComponent {
  @Input({ required: true }) contact!: PhotoContact;
  @Input() saving = false;
  @Output() save = new EventEmitter<PhotoContactPayload>();
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  tab: ModelTab = 'data';

  constructor() {
    this.route.fragment.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(fragment => {
      this.tab = fragment === 'reference-images' ? 'gallery' : 'data';
    });
  }

  get primaryImage(): PhotoReferenceImage | undefined { return this.contact.images?.[0]; }

  selectTab(tab: ModelTab): void {
    this.tab = tab;
    void this.router.navigate([], {
      relativeTo: this.route, queryParamsHandling: 'preserve', replaceUrl: true,
      fragment: tab === 'gallery' ? 'reference-images' : 'model-data',
    });
  }

  onTabKeydown(event: KeyboardEvent): void {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 'data' : event.key === 'End' ? 'gallery' : this.tab === 'data' ? 'gallery' : 'data';
    this.selectTab(next);
    (event.currentTarget as HTMLElement).querySelector<HTMLButtonElement>(`#model-tab-${next}`)?.focus();
  }

  updateImages(images: PhotoReferenceImage[]): void {
    // Keep the contact reference so uploads never reset the unsaved data form.
    this.contact.images = images;
    this.contact.images_count = images.length;
  }
}
