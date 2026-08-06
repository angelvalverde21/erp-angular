import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { faBarcode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DecimalPipe, JsonPipe } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { ImagePreviewComponent } from '../../../../shared/components/image-preview/image-preview.component';
import { distinctUntilChanged, filter, Subscription } from 'rxjs';
import { PenPipe } from '../../../../shared/pipes/pen.pipe';
@Component({
  selector: 'app-variant-index-form',
  imports: [
    ButtonComponent,
    FontAwesomeModule,
    DecimalPipe,
    JsonPipe,
    ReactiveFormsModule,
    ImagePreviewComponent,
    PenPipe,
  ],
  templateUrl: './variant-index-form.component.html',
  styleUrl: './variant-index-form.component.scss',
})
export class VariantIndexFormComponent implements OnInit, OnDestroy {
  @Input() variants: any[] = [];
  @Output() formValuesChanged = new EventEmitter<any>();

  faBarcode = faBarcode;
  form!: FormGroup;
  private subscriptions: Subscription[] = [];

  // Fecha mínima para entrega (hoy)
  minDate: string = new Date().toISOString().split('T')[0];

  // Variables para trackear el estado
  private previousValidState: boolean | null = null;
  private validationTimeout: any;

  constructor(private fb: FormBuilder) {
    // Inicializar el formulario con todos los campos
    this.form = this.fb.group({
      comment: ['', [Validators.maxLength(500)]], // Campo de comentario
      delivery_date: [this.getDefaultDeliveryDate(), [Validators.required]], // Campo de fecha de entrega
      variants: this.fb.array(
        [],
        [this.atLeastOneValidVariantValidator.bind(this)],
      ),
    });
  }

  createVariantFormGroup(variant: any): FormGroup {
    return this.fb.group({
      id: [variant.id],
      quantity: [null],
      price: [null],
      price_total: [{ value: 0, disabled: true }],
    });
  }

  private atLeastOneValidVariantValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    const variants = control as FormArray;

    let hasValidVariant = false;

    for (const row of variants.controls) {
      const quantityValue = row.get('quantity')?.value;
      const priceValue = row.get('price')?.value;

      const quantity = Number(quantityValue);
      const price = Number(priceValue);

      const quantityEmpty =
        quantityValue === null || quantityValue === '' || quantityValue === 0;

      const priceEmpty =
        priceValue === null || priceValue === '' || priceValue === 0;

      // La fila está completamente vacía → se ignora
      if (quantityEmpty && priceEmpty) {
        continue;
      }

      // La fila está completa
      if (quantity > 0 && price > 0) {
        hasValidVariant = true;
        continue;
      }

      // La fila fue empezada pero está incompleta
      return {
        invalidVariants: true,
      };
    }

    // Debe existir por lo menos una fila completamente válida
    return hasValidVariant ? null : { noValidVariant: true };
  }

  ngOnInit(): void {
    this.initializeComponent();

    this.form.statusChanges.pipe(distinctUntilChanged()).subscribe((status) => {
      if (status === 'VALID') {
        console.log('✅ Formulario válido');
        this.onFormValid();
      } else {
        console.log('❌ Formulario inválido');
        this.onFormInvalid();
      }
    });
  }

  onFormInvalid(): void {
    // El formulario completo es inválido
    // console.log('Evento disparado - Formulario válido');
  }

  onFormValid(): void {
    // Disparar evento cuando el formulario es válido
    // console.log('Evento disparado - Formulario válido');
    // Aquí puedes ejecutar cualquier acción
  }

  ngOnChanges({ variants }: SimpleChanges) {
    if (variants?.currentValue?.length) {
      this.initializeComponent();
    }
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones para evitar memory leaks
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }

  // Obtener fecha de entrega por defecto (7 días después de hoy)
  getDefaultDeliveryDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 7); // 7 días después
    return date.toISOString().split('T')[0];
  }

  initializeComponent() {
    if (this.variants && this.variants.length > 0) {
      this.initializeFormArray();
    } else {
      console.warn('No hay variantes para inicializar');
    }
  }

  initializeFormArray() {
    const variantArray = this.form.get('variants') as FormArray;
    variantArray.clear();

    // Limpiar suscripciones anteriores
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];

    this.variants.forEach((variant, index) => {
      variantArray.push(this.createVariantFormGroup(variant));

      // Suscribirse a cambios en quantity y price para cada variante
      this.setupPriceCalculation(index);
    });

    // Escuchar cambios en el formulario completo
    const formSubscription = this.form.valueChanges.subscribe((values) => {
      this.formValuesChanged.emit(values);
    });
    this.subscriptions.push(formSubscription);
  }

  // Configurar el cálculo automático del precio total
  setupPriceCalculation(index: number) {
    const variantArray = this.form.get('variants') as FormArray;
    const variantForm = variantArray.at(index) as FormGroup;

    // Suscripción a cambios en quantity
    const quantitySub = variantForm
      .get('quantity')
      ?.valueChanges.subscribe(() => {
        this.calculateTotal(index);
      });

    // Suscripción a cambios en price
    const priceSub = variantForm.get('price')?.valueChanges.subscribe(() => {
      this.calculateTotal(index);
    });

    if (quantitySub) this.subscriptions.push(quantitySub);
    if (priceSub) this.subscriptions.push(priceSub);

    // Calcular el total inicial
    this.calculateTotal(index);
  }

  // Método para calcular el precio total
  calculateTotal(index: number) {
    const variantArray = this.form.get('variants') as FormArray;
    const variantForm = variantArray.at(index) as FormGroup;

    if (!variantForm) return;

    const quantity = Number(variantForm.get('quantity')?.value) || 0;
    const price = Number(variantForm.get('price')?.value) || 0;
    const total = quantity * price;

    // Actualizar el campo price_total (está deshabilitado)
    variantForm
      .get('price_total')
      ?.setValue(total.toFixed(2), { emitEvent: false });
  }

  // Método para calcular el total general de todos los items
  getTotalGeneral(): number {
    const variantArray = this.form.get('variants') as FormArray;
    let total = 0;

    variantArray.controls.forEach((control) => {
      const priceTotal = control.get('price_total')?.value;
      if (priceTotal) {
        total += Number(priceTotal);
      }
    });

    return total;
  }

  get variantsFormArray(): FormArray {
    return this.form.get('variants') as FormArray;
  }

  // Método para obtener los valores actuales
  getFormValues() {
    if (this.form.valid) {
      return this.form.value;
    }
    return null;
  }

  // Método para resetear el formulario
  resetForm() {
    this.form.reset();
    this.initializeFormArray();
  }

  // Método para recalcular todos los totales (útil si se modifica algo externamente)
  recalculateAllTotals() {
    const variantArray = this.form.get('variants') as FormArray;
    variantArray.controls.forEach((control, index) => {
      this.calculateTotal(index);
    });
  }
}
