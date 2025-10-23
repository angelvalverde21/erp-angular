import { Component, Input } from '@angular/core';
import { CategoryRowComponent } from './category-row/category-row.component';

@Component({
  selector: 'app-category-index',
  imports: [CategoryRowComponent],
  templateUrl: './category-index.component.html',
  styleUrl: './category-index.component.scss'
})
export class CategoryIndexComponent {

  @Input() categories: any[] = []; 
  

}
