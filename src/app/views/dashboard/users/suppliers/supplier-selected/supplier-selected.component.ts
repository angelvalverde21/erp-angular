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
export class SupplierSelectedComponent

  implements ControlValueAccessor, OnInit, OnDestroy {

  isDisabled = false;
  supplier_id: number | null = null;
  loading = false;

  @Input() suppliers: any[] = [];

  private destroy$ = new Subject<void>();
  private pendingSupplierId: number | null = null;

  onChangeCb: (value: number | null) => void = () => { };
  onTouchedCb: () => void = () => { };

  constructor(private _supplier: SupplierService) { }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['suppliers']) {
      this.suppliers = this.normalizeSuppliers(changes['suppliers'].currentValue);
    }

  }

  ngOnInit() {
    this.supplierInit();
  }

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

  private supplierInit() {

    this._supplier.index()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: any) => {
        //Da formato porque el json viene de la forma supplier.user.name 

        this.suppliers = this.normalizeSuppliers(resp.data);

        this.trySetSupplier();
      });

  }

  private normalizeSuppliers(suppliers: any[]): any[] {
    return suppliers.map(s => ({
      ...s,
      name: s.user?.name
    }));
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