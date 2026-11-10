import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { HostBinding } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBarcode, faTrash } from '@fortawesome/free-solid-svg-icons';
import { catchError, finalize, map, Observable, of, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ImagePreviewComponent } from '@shared/components/image-preview/image-preview.component';
import { ManufactureVariantService } from '../../manufacture.variants.service';

@Component({
  selector: 'tr[app-manufacture-variant-row]',
  imports: [FontAwesomeModule, ReactiveFormsModule, ImagePreviewComponent],
  templateUrl: './manufacture-variant-row.component.html',
  styleUrl: './manufacture-variant-row.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ManufactureVariantRowComponent implements OnInit, OnDestroy {
  @Input() manufacture_variant: any = {};
  @Input() locked = false;
  @Input() manufactureId = 0;
  @Output() emitDeleteManufactureVariantId = new EventEmitter<number>();
  @Output() emitUpdatedQuantity = new EventEmitter<any>();
  @Output() draftChanged = new EventEmitter<void>();

  faBarcode = faBarcode;
  faTrash = faTrash;
  form!: FormGroup;
  loading = false;
  removeLoading = false;
  saveError = '';
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly service: ManufactureVariantService,
    private readonly fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      quantity: [this.manufacture_variant.quantity ?? 0, [Validators.required, Validators.pattern(/^\d+$/), Validators.max(2147483647)]],
      price: [this.manufacture_variant.price ?? 0, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.max(99999999.99)]],
    });
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.saveError = '';
      this.draftChanged.emit();
    });
  }

  @HostBinding('class.purchase-order-row-pending')
  get hasChanges(): boolean {
    if (!this.form) return false;
    return ['quantity', 'price'].some(field => {
      const value = this.form.get(field)?.value;
      return String(value ?? '').trim() === '' || Number(value) !== Number(this.manufacture_variant[field] ?? 0);
    });
  }

  save(): Observable<boolean> {
    this.form.markAllAsTouched();
    if (!this.hasChanges) return of(true);
    if (this.form.invalid || this.loading || this.removeLoading) return of(false);

    this.loading = true;
    this.saveError = '';
    this.service.setManufactureId(this.manufacture_variant.manufacture_id ?? this.manufactureId);
    const payload = this.form.getRawValue();
    return this.service.update(this.manufacture_variant.id, payload).pipe(
      map((response: any) => {
        if (!response?.data || response.data.id !== this.manufacture_variant.id) {
          throw new Error('Invalid variant response');
        }
        this.manufacture_variant = {
          ...this.manufacture_variant, ...payload, ...response.data,
          variant: { ...this.manufacture_variant.variant, ...response.data.variant },
        };
        this.form.reset({ quantity: this.manufacture_variant.quantity, price: this.manufacture_variant.price }, { emitEvent: false });
        this.emitUpdatedQuantity.emit(this.manufacture_variant);
        return true;
      }),
      catchError(() => {
        this.saveError = 'No se guardó. Puedes reintentar.';
        return of(false);
      }),
      finalize(() => { this.loading = false; }),
      takeUntil(this.destroy$),
    );
  }

  async removeManufactureVariant(id: number, manufactureId: number): Promise<void> {
    if (this.locked || this.loading || this.removeLoading) return;
    const result = await Swal.fire({
      title: '¿Eliminar variante?',
      text: this.hasChanges ? 'Esta variante tiene cambios sin guardar. Se eliminará de la orden.' : 'La variante se eliminará de esta orden.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed || this.locked) return;
    this.removeLoading = true;
    this.draftChanged.emit();
    this.service.destroy(id, manufactureId ?? this.manufactureId).pipe(
      takeUntil(this.destroy$),
      finalize(() => { this.removeLoading = false; }),
    ).subscribe({
      next: () => { this.emitDeleteManufactureVariantId.emit(id); },
      error: () => { Swal.fire('Error', 'No se pudo eliminar la variante. Intenta nuevamente.', 'error'); },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
