import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, forkJoin, Subject, takeUntil } from 'rxjs';
import { UploadDropzoneComponent } from '../../../shared/upload-dropzone/upload-dropzone.component';
import { AttendanceService } from '../attendance.service';
import { ImageIndexComponent } from '../../images/image-index/image-index.component';

@Component({
  selector: 'app-attendance-justification',
  imports: [ReactiveFormsModule, UploadDropzoneComponent, ImageIndexComponent],
  templateUrl: './attendance-justification.component.html',
  styleUrl: './attendance-justification.component.scss',
})
export class AttendanceJustificationComponent implements OnInit, OnDestroy {
  @Input({ required: true }) attendance: any;
  @Output() saved = new EventEmitter<any>();
  @Output() closed = new EventEmitter<void>();
  @ViewChild(UploadDropzoneComponent) uploader?: UploadDropzoneComponent;
  form;
  record: any;
  loading = false;
  error = '';
  uploadError = '';
  pendingFiles = 0;
  uploading = false;
  imagePreviews: any[] = [];
  previewError = '';
  readonly loadingImages = new Set<number>();
  private readonly previewUrls = new Map<number, string[]>();
  private readonly destroy$ = new Subject<void>();

  constructor(fb: FormBuilder, private service: AttendanceService) {
    this.form = fb.nonNullable.group({ reason: ['', [Validators.required, Validators.maxLength(1000), Validators.pattern(/\S/)]] });
  }

  ngOnInit(): void {
    this.record = this.attendance.absence_justified ? this.attendance : null;
    this.form.patchValue({ reason: this.attendance.justification_reason ?? '' });
    this.loadImagePreviews();
  }

  save(): void {
    if (this.loading || this.uploading) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.record && this.form.pristine) { this.uploadFiles(); return; }
    this.loading = true;
    this.error = '';
    this.service.justify({ employee_id: this.attendance.employee_id, date: this.attendance.date, reason: this.form.getRawValue().reason })
      .pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
        next: response => { this.record = response.data; this.saved.emit(this.record); this.form.markAsPristine(); this.loadImagePreviews(); this.uploadFiles(); },
        error: error => this.error = error.error?.message || 'No se pudo guardar la justificación.',
      });
  }

  private uploadFiles(): void {
    if (!this.record || !this.pendingFiles) return;
    this.uploadError = '';
    this.uploader?.uploadQueued('attendances/' + this.record.id + '/justification-documents');
  }

  uploaded(document: any): void {
    this.uploadError = '';
    this.record = { ...this.record, justification_documents: [...(this.record.justification_documents ?? []), document] };
    this.saved.emit(this.record);
    this.loadImagePreviews();
  }

  loadImagePreviews(): void {
    this.previewError = '';
    for (const document of this.record?.justification_documents ?? []) {
      if (!document.is_image || this.previewUrls.has(document.id) || this.loadingImages.has(document.id)) continue;
      this.loadingImages.add(document.id);
      forkJoin({
        thumbnail: this.service.downloadJustification(this.record.id, document.id, 'thumbnail'),
        medium: this.service.downloadJustification(this.record.id, document.id, 'medium'),
        large: this.service.downloadJustification(this.record.id, document.id, 'large'),
      }).pipe(takeUntil(this.destroy$), finalize(() => this.loadingImages.delete(document.id))).subscribe({
        next: files => {
          const urls = [files.thumbnail, files.medium, files.large].map(file => URL.createObjectURL(file));
          this.previewUrls.set(document.id, urls);
          this.imagePreviews = [...this.imagePreviews, { ...document, url_thumbnail: urls[0], url_medium: urls[1], url_large: urls[2] }];
        },
        error: () => this.previewError = 'No se pudieron cargar algunas imágenes de sustento.',
      });
    }
  }

  download(document: any): void {
    this.service.downloadJustification(this.record.id, document.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: file => {
        const url = URL.createObjectURL(file);
        const link = window.document.createElement('a');
        link.href = url; link.download = document.name; link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      },
      error: () => this.uploadError = 'No se pudo descargar el documento.',
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(); this.destroy$.complete();
    for (const urls of this.previewUrls.values()) urls.forEach(url => URL.revokeObjectURL(url));
  }
}
