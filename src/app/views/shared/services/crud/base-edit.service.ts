import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable()
export class BaseEditService<T> {
  form!: FormGroup;
  loading = false;
  loadingIcon = false;
  disabledButton = true;
  success = false;
  entityId = 0;
  entityData!: T;

  protected destroy$ = new Subject<void>();

  constructor(
    protected fb: FormBuilder,
    protected route: ActivatedRoute,
    protected router: Router
  ) {}

  initForm(fields: { [key: string]: any[] }) {
    this.form = this.fb.group(fields);
    this.form.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => this.disabledButton = status !== 'VALID');
  }

listenRouteParams(paramName: string, loadCallback: (id: number) => void) {
  this.route.params
    .pipe(takeUntil(this.destroy$))
    .subscribe(params => {
      this.entityId = +params[paramName];
      loadCallback(this.entityId);
    });
}

  showSuccess(message: string) {
    Swal.fire('Éxito', message, 'success');
  }

  showError(message: string) {
    Swal.fire('Error', message, 'error');
  }

  confirmAction(title: string, text: string, confirmText: string) {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      confirmButtonColor: '#d33',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: 'Cancelar'
    });
  }

  destroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}