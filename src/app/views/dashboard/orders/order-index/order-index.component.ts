import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order-index',
  imports: [],
  templateUrl: './order-index.component.html',
  styleUrl: './order-index.component.scss'
})
export class OrderIndexComponent {

  @Input() orders: any[] = []; 
}
