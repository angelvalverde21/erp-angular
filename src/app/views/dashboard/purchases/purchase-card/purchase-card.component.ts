import { Component, Input } from '@angular/core';
import { PenPipe } from '@shared/pipes/pen.pipe';
@Component({
  selector: 'app-purchase-card',
  imports: [
    PenPipe
  ],
  templateUrl: './purchase-card.component.html',
  styleUrl: './purchase-card.component.scss'
})
export class PurchaseCardComponent {

  @Input() purchase: any; 

}
