import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { faBarcode, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';


@Component({
  selector: 'app-inventory-variant-index',
  imports: [
    ButtonComponent,
    FontAwesomeModule,
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './inventory-variant-index.component.html',
  styleUrl: './inventory-variant-index.component.scss'
})
export class InventoryVariantIndexComponent implements OnInit {


  @Input() variants: any[] = [];
  @Output() inventoryVariantAdded = new EventEmitter<any>();

  @Output() inventoryVariantArraySelected = new EventEmitter<any>();
  @Output() emitInventoryVariantsSelected = new EventEmitter<any>();

  inventory_variant_select: any;

  faBarcode = faBarcode;
  faCheck = faCheck;

  formChildrenIsValid: boolean = false;

  constructor(
    private fb: FormBuilder,
  ) { }

  form!: FormGroup;

  formInit() {
    this.form = this.fb.group({
      variantsForm: this.fb.array([])
    });
  }

  get variantsForm(): FormArray {
    return this.form.controls['variants'] as FormArray;
  }

  ngOnInit(): void {

    this.formInit();

    this.variants.forEach(variant => {
      this.addQuantity();
    });

    // this.inventoryVariantSelectedInit();
  }

  addQuantity() {

    const group = this.fb.group({
      sku: [''],
      stock: [0]
    });

    this.variantsForm.push(group);
  }

  inventoryVariantSelectedInit() {

    this.inventory_variant_select = {};

    this.variants.forEach(variant => {
      this.inventory_variant_select = {
        ...this.inventory_variant_select,
        [variant.id]: false
      };
    })

    console.log(this.inventory_variant_select);
  }

  addVariant(variantId: number) {

    if (this.inventory_variant_select[variantId]) {
      this.inventory_variant_select[variantId] = false;
    } else {
      this.inventory_variant_select[variantId] = true;
    }

    console.log(this.inventory_variant_select);

    // {333: true, 334: false, 335: true, 378: false, 395: true, 2652: false, 2653: false}

    //Esto convierte el objeto en un array con los ids seleccionados (el objeto de arriba quedarÃ­a [333, 335, 395])
    const inventoryVariantsSelected = Object.entries(this.inventory_variant_select)
      .filter(([_, value]) => value === true)
      .map(([key]) => Number(key));

    // y aqui se exporta o emite el array
    this.inventoryVariantArraySelected.emit(inventoryVariantsSelected);

    // this.inventoryVariantArraySelected.emit(inventoryVariantsSelected);
    // const variant = this.variants.find(v => v.id === variantId);

    // if (variant) {
    //   this.inventoryVariantAdded.emit(this.inventory_variant_select);
    // }

    const obj = this.variants.filter(v => inventoryVariantsSelected.includes(v.id));

    console.log(obj);


    this.emitInventoryVariantsSelected.emit(obj);


  }

  ngOnChanges({ variants }: SimpleChanges) {

    console.log("variants changed", variants);

    if (variants?.currentValue?.length) {
      this.inventoryVariantSelectedInit();

    }
  }


}



