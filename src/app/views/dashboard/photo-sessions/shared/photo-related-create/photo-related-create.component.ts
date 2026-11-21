import { Component, DestroyRef, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { PhotoContactService } from '../../contacts/photo-contact.service';
import { PhotoContact, PhotoContactPayload } from '../../contacts/photo-contact.model';
import { PhotoLocationService } from '../../locations/photo-location.service';
import { PhotoLocation, PhotoLocationPayload } from '../../locations/photo-location.model';
import { PhotoSessionOptions, photoSessionError } from '../../photo-session.model';
import { PhotoRelatedCreateDialogComponent, PhotoRelatedKind } from '../photo-related-create-dialog/photo-related-create-dialog.component';

export type CreatedPhotoRelated = { kind: 'photographer' | 'model'; record: PhotoContact } | { kind: 'location'; record: PhotoLocation };

export function addPhotoRelatedOption(options: PhotoSessionOptions, created: CreatedPhotoRelated): PhotoSessionOptions {
  const record = created.record;
  if (created.kind === 'location') {
    const location = created.record;
    const option = { id: location.id, name: location.name, type: location.type, active: location.active, address: location.display_address || location.address?.primary || null };
    return { ...options, locations: [...(options.locations || []).filter(item => item.id !== option.id), option] };
  }
  const option = { id: record.id, name: record.name, active: record.active };
  const key = created.kind === 'model' ? 'models' : 'photographers';
  return { ...options, [key]: [...(options[key] || []).filter(item => item.id !== option.id), option] };
}

/** Directory creation is orchestrated once for both session create and edit. */
@Component({ selector: 'app-photo-related-create', imports: [PhotoRelatedCreateDialogComponent],
  template: `<app-photo-related-create-dialog [kind]="kind" [saving]="saving" [error]="error" (contactSave)="saveContact($event)" (locationSave)="saveLocation($event)" (cancel)="cancel.emit()" />` })
export class PhotoRelatedCreateComponent {
  @Input({ required: true }) kind!: PhotoRelatedKind;
  @Output() created = new EventEmitter<CreatedPhotoRelated>();
  @Output() cancel = new EventEmitter<void>();
  @Output() busy = new EventEmitter<boolean>();
  @ViewChild(PhotoRelatedCreateDialogComponent) private dialog?: PhotoRelatedCreateDialogComponent;
  private readonly contacts = inject(PhotoContactService);
  private readonly locations = inject(PhotoLocationService);
  private readonly destroyRef = inject(DestroyRef);
  private destroyed = false;
  saving = false; error = '';
  constructor() { this.destroyRef.onDestroy(() => this.destroyed = true); }
  saveContact(payload: PhotoContactPayload): void {
    if (this.saving || this.kind === 'location') return;
    const kind = this.kind; this.start();
    this.contacts.create({ ...payload, kind }).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.finishBusy())).subscribe({
      next: result => void this.complete({ kind, record: result.data }), error: error => this.error = photoSessionError(error),
    });
  }
  saveLocation(payload: PhotoLocationPayload): void {
    if (this.saving || this.kind !== 'location') return;
    this.start();
    this.locations.create(payload).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.finishBusy())).subscribe({
      next: result => void this.complete({ kind: 'location', record: result.data }), error: error => this.error = photoSessionError(error),
    });
  }
  private start(): void { this.saving = true; this.error = ''; this.busy.emit(true); }
  private finishBusy(): void { this.saving = false; if (!this.destroyed) this.busy.emit(false); }
  private async complete(created: CreatedPhotoRelated): Promise<void> {
    await this.dialog?.closeAnimated();
    if (!this.destroyed) this.created.emit(created);
  }
}
