import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { faBarcode, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';


@Component({
  selector: 'app-variant-index-selected',
  imports: [
    ButtonComponent,
    FontAwesomeModule,
    FormsModule,
    JsonPipe
  ],
  templateUrl: './variant-index-selected.component.html',
  styleUrl: './variant-index-selected.component.scss'
})
export class VariantIndexSelectedComponent implements OnInit {


  @Input() variants: any[] = [];
  @Output() variantAdded = new EventEmitter<any>();

  @Output() emitVariantsSelected = new EventEmitter<any>();

  variant_select: any;

  faBarcode = faBarcode;
  faCheck = faCheck;

  ngOnInit(): void {
    // this.variantSelectedInit();
  }

  variantSelectedInit() {

    this.variant_select = {};

    this.variants.forEach(variant => {
      this.variant_select = {
        ...this.variant_select,
        [variant.id]: false
      };
    })

    console.log(this.variant_select);
  }

  addVariant(variantId: number) {

    if (this.variant_select[variantId]) {
      this.variant_select[variantId] = false;
    } else {
      this.variant_select[variantId] = true;
    }

    console.log(this.variant_select);

    // {333: true, 334: false, 335: true, 378: false, 395: true, 2652: false, 2653: false}

    //Esto convierte el objeto en un array con los ids seleccionados (el objeto de arriba quedaría [333, 335, 395])
    const variantsSelected = Object.entries(this.variant_select)
      .filter(([_, value]) => value === true)
      .map(([key]) => Number(key));

    // y aqui se exporta o emite el array
    this.emitVariantsSelected.emit(variantsSelected);

    // this.emitVariantsSelected.emit(variantsSelected);
    // const variant = this.variants.find(v => v.id === variantId);

    // if (variant) {
    //   this.variantAdded.emit(this.variant_select);
    // }

  }

  quantityArray: any[] = [];

  //Escucha los cambios de los inputs, en este caso de variants
  ngOnChanges({ variants }: SimpleChanges) {

    console.log("variants changed", variants);

    if (variants?.currentValue?.length) {
      this.variantSelectedInit();
    }
  }

  onQuantityChange(event: any, variantId: number) {

    console.log(event.target.value, variantId);
    
    this.quantityArray[variantId] = event.target.value;

    this.addVariant(variantId);

    console.log(this.variant_select);
    
    console.log(this.quantityArray);
    
  }

}
