import { Component, Input } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { ManufactureVariantRowComponent } from '../manufacture-variant-row/manufacture-variant-row.component';

@Component({
  selector: 'app-manufacture-variant-index',
  imports: [
    ButtonComponent,
    ManufactureVariantRowComponent
  ],
  templateUrl: './manufacture-variant-index.component.html',
  styleUrl: './manufacture-variant-index.component.scss'
})
export class ManufactureVariantIndexComponent {

  @Input() manufacture_variants: any;

  receiveDeleteManufactureVariantId(manufacture_variant_id: number) {

    this.manufacture_variants = this.manufacture_variants.filter((manufacture_variant: any) => manufacture_variant.id !== manufacture_variant_id);

  }



}
