import { Component, Input, OnInit } from '@angular/core';
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
export class ManufactureVariantIndexComponent implements OnInit {


  @Input() manufacture_variants: any;

  total: number = 0;

  ngOnInit(): void {
    this.sumQuantity();
  }

  sumQuantity(): void {
    this.total = this.manufacture_variants.reduce(
      (acc: number, mv: any) => acc + Number(mv.quantity ?? 0),
      0
    );
  }

  receiveDeleteManufactureVariantId(manufacture_variant_id: number) {

    this.manufacture_variants = this.manufacture_variants.filter((manufacture_variant: any) => manufacture_variant.id !== manufacture_variant_id);

  }

  receiveManufactureVariant(manufacture_variant: any): void {
    if (!manufacture_variant) return;

    this.manufacture_variants = this.manufacture_variants.map((mv: any) =>
      mv.id === manufacture_variant.id ? manufacture_variant : mv
    );

    this.sumQuantity();
  }

}
