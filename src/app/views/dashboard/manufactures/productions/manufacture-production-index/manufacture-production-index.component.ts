import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManufactureProductionIndexRowComponent } from '../manufacture-production-index-row/manufacture-production-index-row.component';

@Component({
  selector: 'app-manufacture-production-index',
  imports: [
    ManufactureProductionIndexRowComponent,
    CommonModule
  ],
  templateUrl: './manufacture-production-index.component.html',
  styleUrl: './manufacture-production-index.component.scss'
})
export class ManufactureProductionIndexComponent {

   @Input() productions: any; 

}
