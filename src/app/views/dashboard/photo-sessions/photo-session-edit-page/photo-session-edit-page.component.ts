import { PhotoSectionHeaderComponent } from '../shared/photo-section-header.component';
import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, EMPTY, finalize, forkJoin, startWith, Subject, switchMap } from 'rxjs';
import { PhotoSessionService } from '../photo-session.service';
import { PhotoSession, PhotoSessionOptions, PhotoSessionPayload, photoSessionError } from '../photo-session.model';
import { PhotoSessionEditComponent } from '../photo-session-edit/photo-session-edit.component';
import { PhotoSessionDetailsComponent } from '../photo-session-details/photo-session-details.component';
import { PhotoSessionAssetIndexComponent } from '../photo-session-asset-index/photo-session-asset-index.component';
import { PhotoSessionUploadDialogComponent } from '../photo-session-upload-dialog/photo-session-upload-dialog.component';
import { PhotoSessionWorkspaceComponent } from '../photo-session-workspace/photo-session-workspace.component';
import { PhotoRelatedCreateComponent, CreatedPhotoRelated, addPhotoRelatedOption } from '../shared/photo-related-create/photo-related-create.component';
import type { PhotoRelatedKind } from '../shared/photo-related-create-dialog/photo-related-create-dialog.component';
import type { PhotoAssignmentChange } from '../photo-session-assignment-index/photo-session-assignment-index.component';

@Component({
  selector: 'app-photo-session-edit-page', imports: [DatePipe, PhotoSectionHeaderComponent, RouterLink, PhotoSessionDetailsComponent, PhotoSessionEditComponent, PhotoSessionAssetIndexComponent, PhotoSessionUploadDialogComponent, PhotoSessionWorkspaceComponent, PhotoRelatedCreateComponent],
  templateUrl: './photo-session-edit-page.component.html', styleUrls: ['../photo-session.scss', './photo-session-edit-page.component.scss'],
})
export class PhotoSessionEditPageComponent implements OnInit {
  private readonly api = inject(PhotoSessionService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly refresh$ = new Subject<void>();
  @ViewChild(PhotoSessionAssetIndexComponent) private gallery?: PhotoSessionAssetIndexComponent;
  @ViewChild(PhotoSessionUploadDialogComponent) private uploadDialog?: PhotoSessionUploadDialogComponent;
  @ViewChild(PhotoSessionWorkspaceComponent) private workspace?: PhotoSessionWorkspaceComponent;
  session: PhotoSession | null = null;
  options: PhotoSessionOptions | null = null;
  loading = false; saving = false; uploading = false; editing = false; error = ''; saved = false;
  assignmentSaving = false; relatedSaving = false; addingKind: PhotoRelatedKind | null = null;
  assetCount: number | null = null;
  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.refresh$.pipe(startWith(undefined))]).pipe(switchMap(([params]) => {
      this.loading = true; this.error = ''; this.session = null; this.assetCount = null;
      return forkJoin({ session: this.api.show(Number(params.get('photo_session_id'))), options: this.api.options() })
        .pipe(catchError(error => { this.error = photoSessionError(error); return EMPTY; }), finalize(() => this.loading = false));
    }), takeUntilDestroyed(this.destroyRef)).subscribe(result => { this.session = result.session.data; this.options = result.options.data; });
  }
  retry(): void { this.refresh$.next(); }
  toggleDetailsEdit(): void { this.editing = !this.editing; this.workspace?.goTo('session'); }
  openUpload(): void { this.uploadDialog?.open(); }
  refreshAssets(): void { this.gallery?.refreshAfterUpload(); }
  canLeave(): boolean { return !this.uploading || window.confirm('Hay archivos subiendo. Si sales, se detendrán las cargas pendientes. ¿Salir de la sesión?'); }
  openRelated(kind: PhotoRelatedKind): void { this.error = ''; this.addingKind = kind; }
  get relatedOptions() {
    return this.addingKind === 'location' ? this.options?.locations || [] : this.addingKind === 'model' ? this.options?.models || [] : this.options?.photographers || [];
  }
  get relatedAssignedIds(): number[] {
    if (!this.session) return [];
    if (this.addingKind === 'location') return (this.session.locations || []).map(record => record.id);
    if (this.addingKind === 'model') return (this.session.models || []).map(record => record.id);
    return (this.session.photographers || (this.session.photographer_contact ? [this.session.photographer_contact] : [])).map(record => record.id);
  }
  selectRelated(ids: number[]): void {
    if (this.addingKind) this.changeAssignment({ kind: this.addingKind, ids, mode: 'attach' });
  }
  relatedCreated(created: CreatedPhotoRelated): void {
    if (this.options) this.options = addPhotoRelatedOption(this.options, created);
    this.addingKind = null;
    this.changeAssignment({ kind: created.kind, ids: [created.record.id], mode: 'attach' });
  }
  changeAssignment(change: PhotoAssignmentChange): void {
    if (!this.session || this.assignmentSaving || this.saving) return;
    this.assignmentSaving = true; this.error = ''; this.saved = false;
    this.api.assignments(this.session.id, change.kind, change.ids, change.mode).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.assignmentSaving = false)).subscribe({
      next: result => {
        Object.assign(this.session!, result.data);
        if (change.mode === 'attach' && this.addingKind === change.kind) this.addingKind = null;
      }, error: error => this.error = photoSessionError(error),
    });
  }
  save(payload: PhotoSessionPayload): void {
    if (this.saving || !this.session) return;
    this.saving = true; this.error = ''; this.saved = false;
    const { model_ids, photographer_ids, location_ids, photographer_contact_id, photo_location_id, ...planning } = payload;
    this.api.saveChanges(this.session.id, planning).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving = false)).subscribe({
      next: result => { this.session = result.data; this.editing = false; this.saved = true; }, error: error => this.error = photoSessionError(error),
    });
  }
}
