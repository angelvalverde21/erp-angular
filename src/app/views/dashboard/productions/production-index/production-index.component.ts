import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductionIndexRowComponent } from '../production-index-row/production-index-row.component';

@Component({
  selector: 'app-production-index',
  imports: [
    ProductionIndexRowComponent,
    CommonModule
  ],
  templateUrl: './production-index.component.html',
  styleUrl: './production-index.component.scss'
})
export class ProductionIndexComponent {

   @Input() productions: any; 

}
