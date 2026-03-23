import { Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

import { AttendanceService } from '../attendance.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { AttendanceIndexComponent } from '../attendance-index/attendance-index.component';
import { HeadPageComponent } from '@shared/components/head-page/head-page.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { faClipboardUser, faUpload } from '@fortawesome/free-solid-svg-icons';
import { ButtonBackComponent } from '@shared/components/buttons/button-back/button-back.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-attendance-index-page',
  imports: [
    AttendanceIndexComponent,
    HeadPageComponent,
    LoadingComponent,
    ButtonBackComponent,
    FontAwesomeModule,
    ReactiveFormsModule
  ],
  templateUrl: './attendance-index-page.component.html',
  styleUrl: './attendance-index-page.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AttendanceIndexPageComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  file!: File;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _attendance: AttendanceService,
    private fb: FormBuilder

  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  faClipboardUser = faClipboardUser;
  faUpload = faUpload;

  attendances: any[] = [];
  loading: boolean = true;


  onFileChange(event: any) {

    const file = event.target.files[0];

    if (file) {
      this.file = file;
      this.form.patchValue({
        file: file
      });
    }

  }

  ngOnInit(): void {

    this.form = this.fb.group({
      file: [null, Validators.required]
    });

    this.loading = true;

    this._attendance.index().pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.attendances = resp.data;
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });

  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }


  modal: any;

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true });
  }

  closeModal() {
    this.modal.close();
  }

  submit() {

    if (this.form.invalid) return;

    const formData = new FormData();

    formData.append('file', this.file);

    this._attendance.upload(formData).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'El archivo ha subido correctamente', 'success');
        console.log(resp);
        this.loading = false;
      },
    
      error: (error: any) => {
        Swal.fire('Error','Ocurrió un problema al subir el archivo. Inténtalo nuevamente.','error');
        console.error(error);
      },
    
    });

  }

}
