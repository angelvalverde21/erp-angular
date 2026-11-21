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
  @Input() selectionView = false;
  @Output() variantAdded = new EventEmitter<any>();

  @Output() variantArraySelected = new EventEmitter<any>();
  @Output() emitVariantsSelected = new EventEmitter<any>();

  variant_select: Record<number, boolean> = {};

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

  get allSelected(): boolean { return this.variants.length > 0 && this.variants.every(variant => !!this.variant_select[variant.id]); }

  toggleAll(): void {
    const selected = !this.allSelected;
    this.variant_select = Object.fromEntries(this.variants.map(variant => [variant.id, selected]));
    this.emitSelection();
  }

  addVariant(variantId: number): void {
    this.variant_select[variantId] = !this.variant_select[variantId];
    this.emitSelection();
  }

  private emitSelection(): void {
    const selected = this.variants.filter(variant => this.variant_select[variant.id]);
    this.variantArraySelected.emit(selected.map(variant => Number(variant.id)));
    this.emitVariantsSelected.emit(selected);
  }

  ngOnChanges({ variants }: SimpleChanges) {

    console.log("variants changed", variants);

    if (variants?.currentValue?.length) {
      this.variantSelectedInit();
    }
  }


}
