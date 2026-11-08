import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, finalize, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { CourierFormComponent } from '../courier-form/courier-form.component';
import { CourierService } from '../courier.service';
import { ButtonSaveComponent } from 'src/app/views/shared/components/buttons/button-save/button-save.component';
import { Courier, createCourierForm, courierErrorMessage } from '../courier.model';

@Component({
  selector: 'app-courier-edit',
  imports: [CourierFormComponent, ButtonSaveComponent],
  templateUrl: './courier-edit.component.html',
  styleUrl: './courier-edit.component.scss'
})
export class CourierEditComponent implements OnInit, OnDestroy {
  @Input({ required: true }) courier!: Courier;
  @Output() emitCourierUpdate = new EventEmitter<Courier>();

  form!: FormGroup;
  loadingIcon = false;
  private destroy$ = new Subject<void>();

  constructor(private courierService: CourierService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = createCourierForm(this.fb);
    this.form.patchValue(this.courier);
  }

  update(): void {
    if (this.loadingIcon) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loadingIcon = true;
    this.courierService.update(this.courier.id, this.form.getRawValue()).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loadingIcon = false),
    ).subscribe({
      next: (response) => {
        this.form.markAsPristine();
        this.emitCourierUpdate.emit(response.data);
        Swal.fire('Guardado', 'Courier actualizado correctamente.', 'success');
      },
      error: (error) => Swal.fire('No se pudo guardar', courierErrorMessage(error), 'error'),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}