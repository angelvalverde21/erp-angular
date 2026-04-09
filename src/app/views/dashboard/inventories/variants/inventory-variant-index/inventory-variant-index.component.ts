import { JsonPipe } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBarcode, faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-inventory-variant-index',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FontAwesomeModule,
    JsonPipe
  ],
  templateUrl: './inventory-variant-index.component.html'
})
export class InventoryVariantIndexComponent implements OnInit {

  @Input() variants: any[] = [];

  faBarcode = faBarcode;
  faCheck = faCheck;

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['variants'] && this.variants?.length) {
      this.buildForm();
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      variantsForm: this.fb.array(
        this.variants.map(v =>
          this.fb.group({
            id: [v.id],              // 👈 guardamos id dentro del form
            quantity: ['']
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

}