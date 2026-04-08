import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { faBarcode, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';


@Component({
  selector: 'app-inventory-variant-index-selected',
  imports: [
    ButtonComponent,
    FontAwesomeModule,
    FormsModule,
    JsonPipe
  ],
  templateUrl: './inventory-variant-index-selected.component.html',
  styleUrl: './inventory-variant-index-selected.component.scss'
})
export class InventoryVariantIndexSelectedComponent implements OnInit {


  @Input() variants: any[] = [];
  @Input() products: any[] = [];
  @Output() inventoryVariantAdded = new EventEmitter<any>();

  @Output() emitInventoryVariantsSelected = new EventEmitter<any>();

  inventory_variant_select: any;

  faBarcode = faBarcode;
  faCheck = faCheck;

  ngOnInit(): void {
    // this.inventoryVariantSelectedInit();
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
    this.emitInventoryVariantsSelected.emit(inventoryVariantsSelected);

    // this.emitInventoryVariantsSelected.emit(inventoryVariantsSelected);
    // const variant = this.variants.find(v => v.id === variantId);

    // if (variant) {
    //   this.inventoryVariantAdded.emit(this.inventory_variant_select);
    // }

  }

  quantityArray: any[] = [];

  //Escucha los cambios de los inputs, en este caso de variants
  ngOnChanges({ variants }: SimpleChanges) {

    console.log("variants changed", variants);

    if (variants?.currentValue?.length) {
      this.inventoryVariantSelectedInit();
    }
  }

  onQuantityChange(event: any, variantId: number) {

    console.log(event.target.value, variantId);
    
    this.quantityArray[variantId] = event.target.value;

    this.addVariant(variantId);

    console.log(this.inventory_variant_select);
    
    console.log(this.quantityArray);
    
  }

}



