import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { faBarcode, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-variant-index',
  imports: [
    ButtonComponent,
    FontAwesomeModule
  ],
  templateUrl: './variant-index.component.html',
  styleUrl: './variant-index.component.scss'
})
export class VariantIndexComponent implements OnInit {


  @Input() variants: any[] = [];
  @Output() variantAdded = new EventEmitter<any>();

  @Output() variantArraySelected = new EventEmitter<any>();

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
    this.variantArraySelected.emit(variantsSelected);

    // this.variantArraySelected.emit(variantsSelected);
    // const variant = this.variants.find(v => v.id === variantId);

    // if (variant) {
    //   this.variantAdded.emit(this.variant_select);
    // }

  }

  ngOnChanges({ variants }: SimpleChanges) {

    console.log("variants changed", variants);

    if (variants?.currentValue?.length) {
      this.variantSelectedInit();
    }
  }


}
