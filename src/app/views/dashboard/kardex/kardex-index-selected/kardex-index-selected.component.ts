import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { KardexIndexSelectedRowComponent } from '../kardex-index-selected-row/kardex-index-selected-row.component';

@Component({
  selector: 'app-kardex-index-selected',
  imports: [
    KardexIndexSelectedRowComponent
  ],
  templateUrl: './kardex-index-selected.component.html',
  styleUrl: './kardex-index-selected.component.scss'
})
export class KardexIndexSelectedComponent implements OnInit {


  @Input() variants: any[] = [];
  @Input() color_check: string = 'success';

  @Output() emitKardexVariants = new EventEmitter<any>();

  kardex_variants: any[] = [];
  kardexes: any[] = [];

  ngOnInit(): void {
    this.sumQuantity();
  }

  sum: number = 0;

  receiveVariantKardex(event: any) {
    //  console.log(event);
    this.kardex_variants.push(event);

    if (event.quantity <= 0) {
      this.kardex_variants = this.kardex_variants.filter(item => item.variant_id !== event.variant_id);
 
    } else {
      this.kardex_variants = this.kardex_variants.reduce((acc, current) => {
        const x = acc.find((item: any) => item.variant_id === current.variant_id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc.map((item: any) => item.variant_id === current.variant_id ? current : item);
        }
      }, []);
    }

    this.sumQuantity();

    console.log(this.kardex_variants);

    this.emitKardexVariants.emit(this.kardex_variants);

  }

  sumQuantity(){
    this.sum = this.kardex_variants.reduce((acc, item) => acc + item.quantity, 0);
  }

}
