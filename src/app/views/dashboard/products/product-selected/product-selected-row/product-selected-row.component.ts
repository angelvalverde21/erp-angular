import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { InputGroupComponent } from '../../../../shared/components/form/input-group/input-group.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSquareCheck as faSquareCheckSolid } from '@fortawesome/free-solid-svg-icons';
import { faSquareCheck as faSquareCheckRegular } from '@fortawesome/free-regular-svg-icons';
import { debounceTime, Subject, take, takeUntil } from 'rxjs';
``


@Component({
  selector: 'app-product-selected-row',
  imports: [
    InputGroupComponent,
    JsonPipe,
    ReactiveFormsModule,
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './product-selected-row.component.html',
  styleUrl: './product-selected-row.component.scss'
})
export class ProductSelectedRowComponent implements OnInit, OnDestroy {


  @Output() emitSelectProduct = new EventEmitter<any>();

  purchase$ = new Subject<void>();

  @Input() product: any;
  @Input() size: any;

  faSquareCheckSolid = faSquareCheckSolid;
  faSquareCheckRegular = faSquareCheckRegular;

  form!: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.formInit();
  }

  ngOnInit(): void {

    this.purchase$.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe((formValue: any) => {
      this.emitSelectProduct.emit(formValue);
    });

    this.form.statusChanges.subscribe(status => {
      if (status === 'VALID') {
        this.purchase$.next(this.form.value);
      }
    });

  }

  destroy$ = new Subject<void>();
  
  ngOnDestroy(): void {
  
    this.destroy$.next();
    this.destroy$.complete();
  
  }

  formInit() {
    this.form = this.fb.group({
      quantity: [null, [Validators.required, Validators.min(1)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
    });
  }

  selectProduct(product: any, size: any) {

  }

  formatPrice(): void {
    const control = this.form.get('price');
    if (!control) return;

    let value = control.value;

    if (value === null || value === '') return;

    const number = Number(value);

    if (isNaN(number)) {
      control.setValue(null);
      return;
    }

    control.setValue(number.toFixed(2));
  }

}
