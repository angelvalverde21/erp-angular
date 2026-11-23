import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ManufactureProductionIndexRowComponent } from '../manufacture-production-index-row/manufacture-production-index-row.component';

@Component({
  selector: 'app-manufacture-production-index',
  imports: [
    ManufactureProductionIndexRowComponent,
  ],
  templateUrl: './manufacture-production-index.component.html',
  styleUrl: './manufacture-production-index.component.scss'
})
export class ManufactureProductionIndexComponent {

   @Output() deleted = new EventEmitter<number>();
   @Input() productions: any; 

}
