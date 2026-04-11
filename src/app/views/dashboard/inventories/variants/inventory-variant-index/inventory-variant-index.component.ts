import { CommonModule, JsonPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBarcode, faCheck } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';

@Component({
  selector: 'app-inventory-variant-index',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FontAwesomeModule,
    JsonPipe,
    CommonModule,
    ButtonComponent
  ],
  templateUrl: './inventory-variant-index.component.html'
})
export class InventoryVariantIndexComponent implements OnInit {

  @Input() variants: any[] = [];
  @Output() emitInventoryVariantsSelected = new EventEmitter<any>();

  faBarcode = faBarcode;
  faCheck = faCheck;

  form!: FormGroup;

  sum: number = 0;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {

    this.sumQuantities();

    this.buildForm();

    this.form.valueChanges.subscribe(value => {
      this.sum = value.variantsForm.reduce((acc: number, variant: any) => acc + (variant.quantity || 0), 0);
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['variants'] && this.variants?.length) {
      this.buildForm();
    }
  }

  sumQuantities() {
    this.sum = this.variants.reduce((acc, variant) => acc + (variant.quantity || 0), 0);
    console.log('Initial sum of quantities:', this.sum);

  }

  private buildForm() {
    this.form = this.fb.group({
      variantsForm: this.fb.array(
        this.variants.map(v =>
          this.fb.group({
            variant_id: [v.id],              // 👈 guardamos id dentro del form
            quantity: ["", Validators.required]
          })
        )
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

  // addVariant(index: number) {
  //   const group = this.variantsForm.at(index);
  //   console.log('Variant selected:', group.value);
  // }

  updateStock(){
    const selectedVariants = this.variantsForm.controls
      .map((group, index) => ({ index, ...group.value }))
      .filter(variant => variant.quantity > 0);

    console.log('Selected variants to update:', selectedVariants);

    this.emitInventoryVariantsSelected.emit(selectedVariants);

  }

}