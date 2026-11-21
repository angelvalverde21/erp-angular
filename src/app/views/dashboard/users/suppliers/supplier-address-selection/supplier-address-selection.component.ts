import { Component, DestroyRef, inject, Input, OnChanges } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, distinctUntilChanged, of, startWith, Subject, Subscription, switchMap, tap } from 'rxjs';
import { SupplierAddress, SupplierAddressService } from './supplier-address.service';

@Component({
  selector: 'app-supplier-address-selection', imports: [ReactiveFormsModule],
  templateUrl: './supplier-address-selection.component.html', styleUrl: './supplier-address-selection.component.scss',
})
export class SupplierAddressSelectionComponent implements OnChanges {
  @Input({ required: true }) form!: FormGroup;
  private readonly service = inject(SupplierAddressService);
  private readonly destroyRef = inject(DestroyRef);
  private subscription?: Subscription;
  private addressControl?: AbstractControl;
  private readonly validateAddress: ValidatorFn = control => {
    if (!this.supplierId) return null;
    if (this.loading) return { addressLoading: true };
    if (this.error) return { addressUnavailable: true };
    return this.addresses.length > 1 && !control.value ? { addressRequired: true } : null;
  };
  private readonly retry = new Subject<void>();
  addresses: SupplierAddress[] = [];
  loading = false; error = '';
  get supplierId(): number { return Number(this.form.get('supplier_id')?.value) || 0; }

  ngOnChanges(): void {
    this.subscription?.unsubscribe();
    this.addressControl?.removeValidators(this.validateAddress);
    const supplier = this.form.get('supplier_id');
    if (!supplier || !this.form.get('supplier_address_id')) return;
    this.addressControl = this.form.get('supplier_address_id')!;
    this.addressControl.addValidators(this.validateAddress);
    this.subscription = supplier.valueChanges.pipe(startWith(supplier.value), distinctUntilChanged(),
      tap(() => { this.addresses = []; this.error = ''; }),
      switchMap(() => this.retry.pipe(startWith(undefined),
        switchMap(() => {
          this.loading = !!this.supplierId; this.error = '';
          const control = this.form.get('supplier_address_id')!;
          control.updateValueAndValidity({ emitEvent: false });
          if (!this.supplierId) { control.setValue(null, { emitEvent: false }); return of(null); }
          return this.service.addresses(this.supplierId).pipe(catchError(() => {
            this.error = 'No se pudieron cargar las direcciones del proveedor.';
            return of(null);
          }));
        }))),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(result => {
      this.loading = false;
      const control = this.form.get('supplier_address_id')!;
      if (this.error) { control.updateValueAndValidity({ emitEvent: false }); return; }
      this.addresses = result?.data ?? [];
      const existing = this.addresses.find(address => address.id === Number(control.value));
      const selected = existing ?? (this.addresses.length === 1 ? this.addresses[0] : this.addresses.find(address => address.is_default));
      control.setValue(selected?.id ?? null, { emitEvent: false });
    });
  }
  select(id: number): void {
    const control = this.form.get('supplier_address_id')!;
    control.setValue(id); control.markAsDirty();
  }
  reload(): void { this.retry.next(); }
}
