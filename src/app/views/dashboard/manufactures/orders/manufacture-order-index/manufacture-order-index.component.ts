import { Component, Input } from '@angular/core';
import { ManufactureOrderIndexRowComponent } from '../manufacture-order-index-row/manufacture-order-index-row.component';

@Component({
  selector: 'app-manufacture-order-index',
  imports: [
    ManufactureOrderIndexRowComponent,
  ],
  templateUrl: './manufacture-order-index.component.html',
  styleUrl: './manufacture-order-index.component.scss'
})
export class ManufactureOrderIndexComponent {

  @Input() manufactures: any; 

}
