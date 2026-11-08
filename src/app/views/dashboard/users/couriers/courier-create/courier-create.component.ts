import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, finalize, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { CourierService } from '../courier.service';
import { CourierFormComponent } from '../courier-form/courier-form.component';
import { ButtonSaveComponent } from 'src/app/views/shared/components/buttons/button-save/button-save.component';
import { Courier, createCourierForm, courierErrorMessage } from '../courier.model';

@Component({
  selector: 'app-courier-create',
  imports: [CourierFormComponent, ButtonSaveComponent],
  templateUrl: './courier-create.component.html',
  styleUrl: './courier-create.component.scss'
})
export class CourierCreateComponent implements OnInit, OnDestroy {
  @Output() emitCourierCreate = new EventEmitter<Courier>();
  @Input() button_text = 'Crear courier';

  form!: FormGroup;
  loadingIcon = false;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private courierService: CourierService) {}

  ngOnInit(): void {
    this.form = createCourierForm(this.fb);
  }

  create(): void {
    if (this.loadingIcon) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loadingIcon = true;
    this.courierService.store(this.form.getRawValue()).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loadingIcon = false),
    ).subscribe({
      next: (response) => {
        this.emitCourierCreate.emit(response.data);
      },
      error: (error) => Swal.fire('No se pudo crear', courierErrorMessage(error), 'error'),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}