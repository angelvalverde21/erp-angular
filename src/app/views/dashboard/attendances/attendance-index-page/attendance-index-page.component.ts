import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AttendanceService } from '../attendance.service';
import { AttendanceIndexComponent } from '../attendance-index/attendance-index.component';
import { AttendanceCreateComponent } from '../attendance-create/attendance-create.component';

@Component({
  selector: 'app-attendance-index-page',
  imports: [FormsModule, AttendanceIndexComponent, AttendanceCreateComponent],
  templateUrl: './attendance-index-page.component.html',
  styleUrl: './attendance-index-page.component.scss',
})
export class AttendanceIndexPageComponent implements OnInit, OnDestroy {
  attendances: any[] = [];
  filters = { search: '', start_date: '', end_date: '' };
  meta = { current_page: 1, last_page: 1, total: 0 };
  loading = false;
  error = '';
  uploading = false;
  progress = 0;
  file: File | null = null;
  uploadError = '';
  importResult = '';
  private modal?: NgbModalRef;
  private readonly destroy$ = new Subject<void>();

  constructor(private service: AttendanceService, private modalService: NgbModal) {}

  ngOnInit(): void { this.load(); }

  load(page = 1): void {
    if (this.loading) return;
    this.loading = true;
    this.error = '';
    this.service.list(page, this.filters).pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
      next: (response: any) => {
        this.attendances = response.data;
        this.meta = response.meta;
      },
      error: error => this.error = this.message(error, 'No se pudieron cargar las asistencias.'),
    });
  }

  open(template: TemplateRef<any>): void {
    this.file = null;
    this.uploadError = '';
    this.progress = 0;
    this.modal = this.modalService.open(template, { centered: true, backdrop: 'static', size: 'lg' });
  }

  onFileChange(event: Event): void {
    this.file = (event.target as HTMLInputElement).files?.[0] ?? null;
  }

  submit(): void {
    if (!this.file || this.uploading) return;
    const data = new FormData();
    data.append('file', this.file);
    this.uploading = true;
    this.uploadError = '';
    this.service.upload(data).pipe(takeUntil(this.destroy$), finalize(() => this.uploading = false)).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress && event.total) this.progress = Math.round(100 * event.loaded / event.total);
        if (event.type === HttpEventType.Response) {
          const result = event.body.data;
          this.importResult = result.processed_days + ' jornadas importadas de ' + result.employees + ' empleados.';
          this.modal?.close();
          this.load();
        }
      },
      error: error => this.uploadError = this.message(error, 'No se pudo importar el archivo.'),
    });
  }

  created(): void {
    this.modal?.close();
    this.load();
  }

  private message(error: any, fallback: string): string {
    return error.error?.errors ? Object.values(error.error.errors).flat().join(' ') : fallback;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
