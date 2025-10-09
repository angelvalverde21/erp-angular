import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-variant',
  imports: [CommonModule],
  templateUrl: './table-variant.component.html',
  styleUrl: './table-variant.component.scss'
})
export class TableVariantComponent {


  @Input() variants: any[] = []; 

}
