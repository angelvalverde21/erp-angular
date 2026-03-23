import {
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  SimpleChanges
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { InputGroupComponent } from '@shared/components/form/input-group/input-group.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import Swal from 'sweetalert2';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { NgSelectModule } from '@ng-select/ng-select';
import { SupplierService } from '../supplier.service';
import { Supplier } from '@interfaces/supplier.interface';

@Component({
  selector: 'app-supplier-selected',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    LoadingComponent,
    NgSelectModule
  ],
  templateUrl: './supplier-selected.component.html',
  styleUrl: './supplier-selected.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SupplierSelectedComponent),
      multi: true,
    }
  ]
})
export class SupplierSelectedComponent implements ControlValueAccessor, OnDestroy {

  isDisabled = false;
  supplier_id: number | null = null;
  loading = false;

  @Input() suppliers: Supplier[] = [];

  private destroy$ = new Subject<void>();
  private pendingSupplierId: number | null = null;

  onChangeCb: (value: number | null) => void = () => { };
  onTouchedCb: () => void = () => { };

  constructor(private _supplier: SupplierService) { }


  writeValue(value: number | null): void {
    this.pendingSupplierId = value;
    this.trySetSupplier();
  }

  registerOnChange(fn: any): void {
    this.onChangeCb = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  setSupplier(supplierId: number | null) {
    this.supplier_id = supplierId;
    this.onChangeCb(supplierId);
    this.onTouchedCb();
  }


  private trySetSupplier() {
    if (!this.suppliers.length || this.pendingSupplierId == null) return;
    this.supplier_id = this.pendingSupplierId;
    this.pendingSupplierId = null;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}