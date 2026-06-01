import { CommonModule, JsonPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBarcode } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from 'src/app/views/shared/components/buttons/button/button.component';
import { BarcodeService } from '../barcode.service';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { atLeastOneQuantityValidator } from '../../../shared/validators/quantity.validator';

@Component({
  selector: 'app-barcode-index',
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    ButtonComponent,
    FontAwesomeModule,
    CommonModule
  ],
  templateUrl: './barcode-index.component.html',
  styleUrl: './barcode-index.component.scss'
})
export class BarcodeIndexComponent implements OnInit, OnDestroy {


  @Output() emitPrintStatus = new EventEmitter<boolean>();


  faBarcode = faBarcode;

  disabled: boolean = false;

  @Input() variants: any[] = [];

  constructor(
    private fb: FormBuilder,
    private _barcode: BarcodeService
  ) {

  }

  sum: number = 0;

  form!: FormGroup;

  ngOnInit(): void {

    this.sumQuantities();

    this.formInit();

    this.form.valueChanges.subscribe(value => {
      this.sum = value.variantsForm.reduce((acc: number, variant: any) => acc + (variant.quantity || 0), 0);
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['variants'] && this.variants?.length) {
      this.formInit();
    }
  }

  sumQuantities() {
    this.sum = this.variants.reduce((acc, variant) => acc + (variant.quantity || 0), 0);
    console.log('Initial sum of quantities:', this.sum);

  }

  formInit() {
    this.form = this.fb.group({
      variantsForm: this.fb.array(
        this.variants.map(v =>
          this.fb.group({
            id: [v.id],
            sku: [v.sku],
            quantity: [""]
          })
        ),
        { validators: atLeastOneQuantityValidator() }
      )
    });

    // 🔥 Debug reactivo real
    this.form.valueChanges.subscribe(value => {
      console.log('FORM VALUE:', value);
    });
  }



  get variantsForm(): FormArray {
    return this.form.get('variantsForm') as FormArray;
  }

  loading: boolean = false;

  printBarcode() {

    const selectedVariants = this.variantsForm.controls
      .map((group, index) => ({ index, ...group.value }))
      .filter(variant => variant.quantity > 0);

    console.log('Selected variants to update:', selectedVariants);

    this.loading = true;

    Swal.fire({
      title: 'Espere...',
      html: 'Generando etiquetas',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    })


    this._barcode.print(selectedVariants).pipe(takeUntil(this.destroy$)).subscribe({

      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // 👇 Abre el PDF en otra pestaña sin exponer tu API
        window.open(url, '_blank');

        this.emitPrintStatus.emit(true);

        Swal.close();

        // Limpia la URL después de unos segundos
        setTimeout(() => window.URL.revokeObjectURL(url), 10000);

      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al generar el PDF.', 'error');
        console.error(error);
        this.loading = false;
      },

    });

  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }
}
