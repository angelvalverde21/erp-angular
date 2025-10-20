// src/app/services/create-form.service.ts
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })

export class BaseCreateService {
  loading = false;
  loadingIcon = false;
  disabledButton = true;
  success = false;
  form!: FormGroup;

  // Subject privado
  private createSource = new Subject<any[] | boolean>();

  // Observable público
  create$ = this.createSource.asObservable();

  constructor(private fb: FormBuilder) {}

  initForm(fields: { [key: string]: any[] }) {
    this.form = this.fb.group(fields);
    this.form.statusChanges.subscribe((status) => {
      this.disabledButton = status !== 'VALID';
    });
  }

  create(apiMethod: (data: any) => any) {
    this.success = false;
    this.loadingIcon = true;
    this.disabledButton = true;

    if (this.form.invalid) {
      Swal.fire(
        'Error',
        'Por favor completa todos los campos requeridos.',
        'error'
      );
      this.loadingIcon = false;
      return;
    }

    apiMethod(this.form.getRawValue()).subscribe({
      next: (resp: any) => {
        Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        this.success = true;
        this.loadingIcon = false;
        // Emitir el evento usando .next()
        this.createSource.next(resp.data);
      },
      error: (error: any) => {
        Swal.fire(
          'Error',
          'Ocurrió un problema al crear. Inténtalo nuevamente.',
          'error'
        );
        this.loadingIcon = false;
        console.error(error);
      },
    });
  }
}